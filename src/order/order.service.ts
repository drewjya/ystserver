import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { OrderDetailReduser, OrderQuery } from 'src/common/query/order.query';
import { UserQuery } from 'src/common/query/user.query';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { countDuration, extractTime } from 'src/utils/extract/time.extract';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
    private notificationService: NotificationService,
    private orderQuery: OrderQuery,
  ) {}

  async getHistoryOrderUser(userId: number, status: OrderStatus) {
    await this.userQuery.findSuperAdminUnique(userId, [Role.USER]);
    return this.prisma.order.findMany({
      where: {
        userId,
        orderStatus: {
          equals: status,
        },
      },
      select: {
        orderId: true,
        id: true,
        cabang: {
          select: {
            id: true,
            nama: true,
          },
        },
        orderTime: true,
        createdAt: true,
        orderStatus: true,
        orderDetails: {
          select: {
            treatment: {
              select: {
                id: true,
                nama: true,
                category: {
                  select: {
                    id: true,
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getHistoryOrderAdmin(userId: number, status: OrderStatus) {
    const user = await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);
    if (user.role === Role.ADMIN) {
      return this.prisma.order.findMany({
        where: {
          orderStatus: status,
          cabangId: user.adminCabang.id,
        },
        select: {
          id: true,
          orderId: true,
          totalPrice: true,
          orderStatus: true,
          createdAt: true,
          orderTime: true,
          cabang: {
            select: {
              id: true,
              nama: true,
            },
          },
          picture: true,
        },
      });
    }
    return this.prisma.order.findMany({
      where: {
        orderStatus: status,
      },
      select: {
        id: true,
        orderId: true,
        totalPrice: true,
        orderStatus: true,
        createdAt: true,
        orderTime: true,
        cabang: {
          select: {
            id: true,
            nama: true,
          },
        },
        picture: true,
      },
    });
  }

  async createOrder(userId: number, body: CreateOrderDto) {
    await this.userQuery.findSuperAdminUnique(userId, [Role.USER]);

    const cabang = await this.orderQuery.getCabangDetail(body.cabangId);
    const orderDate = body.orderDate;
    const time = extractTime(body.orderTime);
    const totalMinutes = countDuration(time);
    orderDate.setHours(time.hour, time.minute, 0, 0);

    const orderDetail: OrderDetailReduser[] = body.treatementDetail.map((t) => {
      const curr = cabang.treatmentCabang.find((tc) => tc.treatmentId === t);
      return {
        treatmentId: t,
        price: curr.price,
        happyHourPrice: curr.happyHourPrice,
        optional: curr.treatment.category.optional,
        durasi: curr.treatment.durasi,
        name: `${curr.treatment.nama} (${curr.treatment.category.nama})`,
        canHappyHour: curr.treatment.category.happyHourPrice,
      };
    });

    const { nonOptional, optional } =
      this.orderQuery.splitOrderDetail(orderDetail);

    //TODO: CHECK WITH CORRECT DATA
    let isHappyHourDay = {
      value: false,
      data: {
        startDay: -1,
        endDay: -1,
        startHour: '-1',
        endHour: '-1',
      },
    };
    const happDetail = cabang.happyHour.happyHourDetail;
    for (let index = 0; index < happDetail.length; index++) {
      const item = happDetail[index];
      if (
        item.startDay <= orderDate.getDay() &&
        item.endDay >= orderDate.getDay()
      ) {
        isHappyHourDay.value = true;
        isHappyHourDay.data = item;

        break;
      }
    }

    let nonoption: {
      price: number;
      durasi: number;
      treatmentId: number;
      name: string;
    }[] = [];
    let currentHour = totalMinutes;
    for (const iterator of nonOptional) {
      let val = {
        price: iterator.price,
        durasi: iterator.durasi,
        treatmentId: iterator.treatmentId,
        name: iterator.name,
      };
      if (isHappyHourDay) {
        const startH = countDuration(
          extractTime(isHappyHourDay.data.startHour),
        );
        const endH = countDuration(extractTime(isHappyHourDay.data.endHour));

        if (startH <= currentHour && endH >= currentHour) {
          val.price = iterator.happyHourPrice;
          currentHour += iterator.durasi;
        } else {
          val.price = iterator.price;
          currentHour += iterator.durasi;
        }
      }
      nonoption = [...nonoption, val];
    }

    if (body.therapistId) {
      await this.orderQuery.timeslotChecker({
        therapistId: body.therapistId,
        orderDate: orderDate,
        cabangId: body.cabangId,
        timeOrder: body.orderTime,
        treatementDetail: body.treatementDetail,
      });
    }

    const order = await this.orderQuery.createOrder({
      cabangId: body.cabangId,
      guestGender: body.guestGender,
      nonoption: nonoption,
      optional: optional,
      orderDate: orderDate,
      therapistGender: body.therapistGender,
      time: time,
      userId: userId,
      therapistId: body.therapistId,
    });
    await this.notificationService.sendEmailNotification({
      orderId: order.id,
      title: `YST Fammily - Order ${order.orderId}`,
      userId: userId,
    });
    return order;
  }

  async uploadBuktiBayar(params: {
    file: Express.Multer.File;
    userId: number;
    orderId: number;
  }) {
    const { file, orderId, userId } = params;
    await this.userQuery.findSuperAdminUnique(userId, [Role.USER]);
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId: userId,
      },
    });
    if (!order) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Order tidak ditemukan',
      });
    }

    if (order.pictureId) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'Bukti bayar sudah diupload',
      });
    }
    return this.prisma.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        picture: {
          create: {
            path: file.path,
          },
        },
      },
    });
  }

  async updateStatusOrder(param: {
    userId: number;
    orderId: number;
    status: OrderStatus;
    therapistId?: number;
  }) {
    const { orderId, status, userId, therapistId } = param;
    await this.userQuery.findSuperAdminUnique(userId, [
      Role.SUPERADMIN,
      Role.ADMIN,
    ]);

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Order tidak ditemukan',
      });
    }

    if (
      status === OrderStatus.RESCHEDULE ||
      status === OrderStatus.PENDING ||
      status === OrderStatus.CONFIRMED ||
      status === OrderStatus.COMPLETE ||
      status === OrderStatus.ONGOING
    ) {
      if (
        !therapistId &&
        (status === OrderStatus.RESCHEDULE || status === OrderStatus.COMPLETE)
      ) {
        throw new ApiException({
          status: HttpStatus.BAD_REQUEST,
          data: 'Therapist id is required',
        });
      }
      let therapist;
      if (therapistId) {
        therapist = {
          connect: {
            id: therapistId,
          },
        };
      }
      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          therapist: therapist,
          orderStatus: status,
        },
      });

      let description = '';
      if (status === OrderStatus.RESCHEDULE) {
        if (therapistId) {
          description = `Therapist yang anda pilih tidak tersedia dan telah diganti dengan therapist lainnya`;
        } else {
          description = `Therapist yang anda pilih tidak tersedia. Silahkan tunggu konfirmasi dari kami`;
        }
      } else if (status === OrderStatus.PENDING) {
        description = `Order anda sedang diproses`;
      } else if (status === OrderStatus.CONFIRMED) {
        description = `Selamat order anda sedang dikonfirmasi`;
      } else if (status === OrderStatus.COMPLETE) {
        description = `Selamat order anda telah selesai. Silahkan beri rating untuk therapist anda`;
      } else if (status === OrderStatus.ONGOING) {
        description = `Order anda sedang berlangsung`;
      }
      await this.notificationService.sendNotification({
        userId: order.userId,
        title: `YST Fammily - Order ${order.orderId}`,
        description: description,
      });
    } else {
      const order = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderStatus: status,
        },
      });

      await this.notificationService.sendNotification({
        userId: order.userId,
        title: `YST Fammily - Order ${order.orderId}`,
        description: `Anda terlambat melakukan pembayaran, order anda telah dibatalkan`,
      });
    }
    await this.notificationService.sendEmailNotification({
      userId: order.userId,
      orderId: order.id,
      title: `YST Fammily - Order ${order.orderId}`,
    });
  }
}
