import { HttpStatus, Injectable } from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { TherapistQuery } from 'src/common/query/therapist.query';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { countDuration, extractTime } from 'src/utils/extract/time.extract';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  

  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
    private therapistQuery: TherapistQuery
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

    const cabang = await this.prisma.cabang.findUnique({
      where: {
        id: body.cabangId,
        deletedAt: null,
      },
      select: {
        treatmentCabang: {
          select: {
            treatmentId: true,
            treatment: {
              select: {
                nama: true,
                category: {
                  select: {
                    nama: true,
                    optional: true,
                    id: true,
                    happyHourPrice: true,
                  },
                },
                durasi: true,
              },
            },
            price: true,
            happyHourPrice: true,
          },
        },
        happyHour: {
          select: {
            publicHoliday: true,

            happyHourDetail: {
              select: {
                startDay: true,
                endDay: true,
                startHour: true,
                endHour: true,
              },
            },
          },
        },
      },
    });
    if (!cabang) {
      throw new ApiException({
        status: 404,
        data: 'Cabang tidak ditemukan',
      });
    }
    const orderDate = body.orderDate;
    const time = extractTime(body.orderTime);
    const totalMinutes = countDuration(time);
    orderDate.setHours(time.hour, time.minute, 0, 0);
    console.log(orderDate);

    const orderDetail = body.treatementDetail.map((t) => {
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

    const splitByOptional = orderDetail.reduce(
      (acc, curr) => {
        if (curr.optional) {
          acc.optional.push(curr);
        } else {
          acc.notOptional.push(curr);
        }
        return acc;
      },
      {
        optional: <
          {
            treatmentId: number;
            price: number;
            happyHourPrice: number;
            name: string;
            optional: boolean;
            durasi: number;
            canHappyHour: boolean;
          }[]
        >[],
        notOptional: <
          {
            treatmentId: number;
            price: number;
            happyHourPrice: number;
            name: string;
            optional: boolean;
            durasi: number;
            canHappyHour: boolean;
          }[]
        >[],
      },
    );

    if (
      splitByOptional.notOptional.length > 2 ||
      splitByOptional.notOptional.length === 0
    ) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'Maksimal treatmen hanya 2',
      });
    }
    const nonOptional = splitByOptional.notOptional.sort((a, b) => {
      // Sort by canHappyHour (true first)
      if (a.canHappyHour !== b.canHappyHour) {
        if (b.canHappyHour && !a.canHappyHour) {
          return 1;
        }
        if (a.canHappyHour && !b.canHappyHour) {
          return -1;
        }
        return 0;
      } else {
        // If canHappyHour is the same, sort by descending duration
        return b.durasi - a.durasi;
      }
    });

    const optional = splitByOptional.optional.map((e) => {
      return {
        price: e.price,
        durasi: e.durasi,
        treatmentId: e.treatmentId,
        name: e.name,
      };
    });

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
      const therapist = await this.prisma.therapist.findUnique({
        where: {
          id: body.therapistId,
          cabangId: body.cabangId,
        },
        select: {
          therapistTreatment: {
            select: {
              treatmentId: true,
            },
          },
        },
      });
      if (!therapist) {
        throw new ApiException({
          status: 404,
          data: 'Therapist tidak ditemukan',
        });
      }

      const timeSlot = await this.therapistQuery.generateTimeSlot({
        cabangId: body.cabangId,
        therapistId: body.therapistId,
        date: new Date(body.orderDate),
      });
      console.log(timeSlot.timeSlot, 'TIMESLOT');

      const maksrange = 2 * 60; //hour = 60
      const timeVal = timeSlot.timeSlot.map((e) =>
        countDuration(extractTime(e)),
      );
      const orderTime = countDuration(extractTime(body.orderTime));
      console.log(
        `${timeVal} Timeslot, ${maksrange} range 2hour, ${orderTime} orderTime`,
      );
      let between = false;
      for (let index = 0; index < timeVal.length; index++) {
        const element = timeVal[index];
        console.log(
          `${element} TimeSlot, ${orderTime} orderTime, maks ${element + maksrange}`,
        );

        if (
          element === orderTime ||
          (orderTime <= element + maksrange && orderTime >= element)
        ) {
          between = true;
          break;
        }
      }
      if (!between) {
        throw new ApiException({
          status: 400,
          data: 'Therapist tidak tersedia',
        });
      }
      console.log(between, 'between');

      const treatments = therapist.therapistTreatment.map((t) => t.treatmentId);
      const isTreatmentValid = body.treatementDetail.every((t) =>
        treatments.includes(t),
      );

      if (!isTreatmentValid) {
        throw new ApiException({
          status: 400,
          data: 'Treatment tidak valid',
        });
      }
    }

    let nonIn = nonoption.reduce(
      (acc, curr) => {
        return {
          durasi: acc.durasi + curr.durasi,
          price: acc.price + curr.price,
        };
      },
      {
        durasi: 0,
        price: 0,
      },
    );
    const optionIn = optional.reduce(
      (acc, curr) => {
        return {
          durasi: acc.durasi + curr.durasi,
          price: acc.price + curr.price,
        };
      },
      {
        durasi: 0,
        price: 0,
      },
    );

    let therapist;
    if (body.therapistId) {
      therapist = {
        connect: {
          id: body.therapistId,
        },
      };
    }

    function orderDateG(param: Date) {
      const date = new Date(param);
      console.log(date, 'TZO');

      date.setHours(time.hour + 7, time.minute, 0, 0);

      return date;
    }

    const order = await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },

        guestGender: body.guestGender,
        orderTime: orderDateG(body.orderDate),
        therapistGender: body.therapistGender,
        cabang: {
          connect: {
            id: body.cabangId,
          },
        },
        durasi: optionIn.durasi + nonIn.durasi,
        totalPrice: optionIn.price + nonIn.price,
        therapist: therapist,
        orderDetails: {
          createMany: {
            skipDuplicates: true,
            data: [
              ...optional.map((e) => {
                return {
                  duration: e.durasi,
                  nama: e.name,
                  price: e.price,
                  treatmentId: e.treatmentId,
                };
              }),
              ...nonoption.map((e) => {
                return {
                  nama: e.name,
                  duration: e.durasi,
                  price: e.price,
                  treatmentId: e.treatmentId,
                };
              }),
            ],
          },
        },
      },
    });
    return order;
  }
}
