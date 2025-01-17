import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { OrderDetailReduser, OrderQuery } from 'src/common/query/order.query';
import { UserQuery } from 'src/common/query/user.query';
import { removeStoragePath } from 'src/config/upload.config';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { VDate } from 'src/utils/date/timezone.date';
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
    const orders = await this.prisma.order.findMany({
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
            price: true,

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

    return orders.map((order) => {
      const totalPrice = order.orderDetails.reduce(
        (acc, curr) => acc + curr.price,
        0,
      );
      const countOrder = order.orderDetails.length;

      return {
        orderId: order.orderId,
        id: order.id,
        countOrder: countOrder,
        cabang: order.cabang.nama,
        orderTime: order.orderTime,
        createdAt: order.createdAt,
        orderStatus: order.orderStatus,
        totalPrice: totalPrice,
        orderName: `${order.orderDetails[0].treatment.nama} (${order.orderDetails[0].treatment.category.nama})`,
      };
    });
  }

  async getHistoryOrderAdminCabang(
    userId: number,
    cabangId: number,
    status: OrderStatus,
  ) {
    const user = await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);
    if (user.role === Role.ADMIN && user.adminCabang.id !== cabangId) {
      throw new ApiException({
        status: HttpStatus.UNAUTHORIZED,
        data: 'Unauthorized',
      });
    }
    return this.prisma.order.findMany({
      where: {
        orderStatus: status,
        cabangId: cabangId,
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
          if (iterator.canHappyHour) {
            val.price = iterator.happyHourPrice;
          } else {
            val.price = iterator.price;
          }
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
    if (!body.therapistId) {
      await this.orderQuery.randomOrderChecker({
        cabangId: body.cabangId,
        orderDate: body.orderDate,
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
      phoneNumber: body.phoneNumber,
      userId: userId,
      therapistId: body.therapistId,
    });
    await this.notificationService.sendEmailNotification({
      orderId: order.id,
      title: `YST Family - ${order.orderId}`,
      userId: userId,
    });
    return order;
  }

  async previewOrder(userId: number, body: CreateOrderDto) {
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
        console.log(isHappyHourDay.data.endHour);
        console.log(currentHour / 60);

        if (startH <= currentHour && endH >= currentHour) {
          if (iterator.canHappyHour) {
            val.price = iterator.happyHourPrice;
          } else {
            val.price = iterator.price;
          }
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

    if (!body.therapistId) {
      await this.orderQuery.randomOrderChecker({
        cabangId: body.cabangId,
        orderDate: body.orderDate,
      });
    }

    const order = await this.orderQuery.previewOrder({
      guestGender: body.guestGender,
      nonoption: nonoption,
      optional: optional,
      orderDate: orderDate,
      therapistGender: body.therapistGender,
      time: time,
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
            path: removeStoragePath(file.path),
          },
        },
      },
    });
  }

  async updateStatusOrder(param: {
    userId: number;
    orderId: number;
    status: OrderStatus;
    therapistId: number;
  }) {
    const { orderId, status, userId, therapistId } = param;
    const user = await this.userQuery.findSuperAdminUnique(userId, [
      Role.SUPERADMIN,
      Role.ADMIN,
    ]);

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (user.adminCabang) {
      if (order.cabangId != user.adminCabang.id) {
        throw new ApiException({
          status: HttpStatus.UNAUTHORIZED,
          data: 'Unauthorized',
        });
      }
    }

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
      let therapist = {
        connect: {
          id: therapistId,
        },
      };
      let confirmation;
      if (status === OrderStatus.CONFIRMED) {
        confirmation = VDate.now();
      }
      await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          therapist: therapist,
          orderStatus: status,
          confirmationTime: confirmation,
        },
      });

      let description = `Order ${order.orderId}`;
      let title = 'Order ';
      if (status === OrderStatus.RESCHEDULE) {
        title += 'Reschedule';
        description = `Therapist yang anda pilih tidak tersedia dan telah diganti dengan therapist lainnya`;
      } else if (status === OrderStatus.PENDING) {
        title += 'Pending';
        description += ` anda sedang diproses`;
      } else if (status === OrderStatus.CONFIRMED) {
        title += 'Confirmed';
        description += ` telah dikonfirmasi`;
      } else if (status === OrderStatus.COMPLETE) {
        title += 'Complete';
        description += ` telah selesai. Silahkan beri rating untuk therapist anda`;
      } else if (status === OrderStatus.ONGOING) {
        title += 'Ongoing';
        description += ` sedang berlangsung`;
      }
      await this.notificationService.sendNotification({
        userId: order.userId,
        title: `YST Family - ${title}`,
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
        title: `YST Family - Order Cancelled`,
        description: `${order.orderId} telah dibatalkan karena pembayaran terlambat`,
      });
    }
    await this.notificationService.sendEmailNotification({
      userId: order.userId,
      orderId: order.id,
      title: `YST Family - ${order.orderId}`,
    });
  }

  async getOrderDetail(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        orderId: true,
        id: true,
        orderTime: true,
        orderStatus: true,
        guestGender: true,
        therapistGender: true,
        guestPhoneNumber: true,

        therapist: {
          select: {
            id: true,
            no: true,
            nama: true,
          },
        },
        confirmationTime: true,

        cabang: {
          select: {
            id: true,
            nama: true,
            phoneNumber: true,
          },
        },
        durasi: true,
        picture: {
          select: {
            path: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            id: true,
            gender: true,
          },
        },
        totalPrice: true,
        createdAt: true,
        orderDetails: {
          select: {
            duration: true,
            nama: true,
            price: true,
          },
        },
      },
    });
    return {
      orderId: order.orderId,
      id: order.id,
      orderTime: order.orderTime,
      orderStatus: order.orderStatus,
      guestGender: order.guestGender,
      therapistGender: order.therapistGender,
      therapist: order.therapist?.no,
      therapistId: order.therapist?.id,

      cabang: order.cabang.nama,
      cabangPhone: order.cabang.phoneNumber,
      cabangId: order.cabang.id,
      durasi: order.durasi,
      guestPhone: order.guestPhoneNumber,
      user: order.user,
      createdAt: order.createdAt,
      confirmationTime: order.confirmationTime ?? null,
      orderDetail: order.orderDetails,
      totalPrice: order.totalPrice,
      picture: order.picture?.path ?? null,
    };
  }

  async cancelMultipleOrder(param: { userId: number }) {
    await this.userQuery.findSuperAdminUnique(param.userId, [Role.SUPERADMIN]);
    const dateString = VDate.getUtcDateToday();
    const order = await this.prisma.order.findMany({
      where: {
        orderStatus: OrderStatus.PENDING,
        pictureId: null,
        orderTime: {
          gte: dateString.start,
          lt: dateString.end,
        },
      },
      include: {
        orderDetails: {
          select: {
            treatment: {
              select: {
                durasi: true,
              },
            },
          },
        },
      },
    });
    for (const iterator of order) {
      await this.updateStatusOrder({
        orderId: iterator.id,
        status: OrderStatus.CANCELLED,
        userId: param.userId,
        therapistId: null,
      });
    }

    return true;
  }
}
