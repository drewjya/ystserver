import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { dateFormat } from 'src/config/format';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import {
  countDuration,
  extractTime,
  Time,
} from 'src/utils/extract/time.extract';
import { TherapistQuery } from './therapist.query';
import { VDate } from 'src/utils/date/timezone.date';

@Injectable()
export class OrderQuery {
  constructor(
    private prisma: PrismaService,
    private therapistQuery: TherapistQuery,
  ) {}

  async timeslotChecker(param: {
    therapistId: number;
    cabangId: number;
    orderDate: Date;
    timeOrder: string;
    treatementDetail: number[];
  }) {
    const { therapistId, cabangId, orderDate, timeOrder, treatementDetail } =
      param;
    const therapist = await this.prisma.therapist.findUnique({
      where: {
        id: therapistId,
        cabangId: cabangId,
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
      cabangId: cabangId,
      therapistId: therapistId,
      date: new Date(orderDate),
    });

    const maksrange = 2 * 60; //hour = 60
    const timeVal = timeSlot.timeSlot.map((e) => countDuration(extractTime(e)));
    const orderTime = countDuration(extractTime(timeOrder));
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
    const isTreatmentValid = treatementDetail.every((t) =>
      treatments.includes(t),
    );

    if (!isTreatmentValid) {
      throw new ApiException({
        status: 400,
        data: 'Treatment tidak valid',
      });
    }
  }

  async getCabangDetail(cabangId: number) {
    const cabang = await this.prisma.cabang.findUnique({
      where: {
        id: cabangId,
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
    console.log('=====ORDERQUERY, CABANG DETAIL=====');

    return cabang;
  }

  async createOrder(params: {
    userId: number;
    cabangId: number;
    guestGender: Gender;
    therapistGender: Gender;
    therapistId?: number;
    time: Time;
    orderDate: Date;
    optional: OrderData[];
    nonoption: OrderData[];
  }) {
    const {
      userId,
      guestGender,
      therapistGender,
      cabangId,
      therapistId,
      time,
      orderDate,
      nonoption,
      optional,
    } = params;
    function orderDateG(param: Date) {
      const date = new Date(param);

      return date;
    }
    let therapist;
    if (therapistId) {
      therapist = {
        connect: {
          id: therapistId,
        },
      };
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

    const date = dateFormat(VDate.now(), 'YYYYMMDD');
    const hh = dateFormat(VDate.now(), 'HHmm');
    const orderId = `TXD/${date}/YST/${userId}${therapistId ?? ''}${cabangId}${hh}`;
    return await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        orderId: orderId,
        guestGender: guestGender,
        orderTime: orderDateG(orderDate),
        therapistGender: therapistGender,
        cabang: {
          connect: {
            id: cabangId,
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
  }

  async previewOrder(params: {
    guestGender: Gender;
    therapistGender: Gender;

    time: Time;
    orderDate: Date;
    optional: OrderData[];
    nonoption: OrderData[];
  }) {
    const {
      guestGender,
      therapistGender,

      orderDate,
      nonoption,
      optional,
    } = params;
    function orderDateG(param: Date) {
      const date = new Date(param);
      return date;
    }
    let therapist;

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

    return {
      guestGender: guestGender,
      orderTime: orderDateG(orderDate),
      therapistGender: therapistGender,
      durasi: optionIn.durasi + nonIn.durasi,
      totalPrice: optionIn.price + nonIn.price,
      therapist: therapist,
      orderDetails: [
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
    };
  }

  splitOrderDetail(orderDetail: OrderDetailReduser[]) {
    const splitByOptional: {
      optional: OrderDetailReduser[];
      notOptional: OrderDetailReduser[];
    } = orderDetail.reduce(
      (acc, curr) => {
        if (curr.optional) {
          acc.optional.push(curr);
        } else {
          acc.notOptional.push(curr);
        }
        return acc;
      },
      {
        optional: [],
        notOptional: [],
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
      if (a.canHappyHour && b.canHappyHour) {
        return b.happyHourPrice - a.happyHourPrice;
      }
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

    return {
      nonOptional,
      optional,
    };
  }
}

export type OrderDetailReduser = {
  treatmentId: number;
  price: number;
  happyHourPrice: number;
  name: string;
  optional: boolean;
  durasi: number;
  canHappyHour: boolean;
};

export type OrderData = {
  durasi: number;
  price: number;
  treatmentId: number;
  name: string;
};
