import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender, OrderStatus } from '@prisma/client';
import { TherapistQuery } from 'src/common/query/therapist.query';
import {
  formatStringDate,
  getWeek,
  getWeekDates,
  stringDateThisAndNExt,
} from 'src/config/format';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { extractTime } from 'src/utils/extract/time.extract';
import { CurrUser, VOrder, VOrderDetail } from 'src/utils/types/server.types';
import { UpdateOrderStatusDto } from './server-order.dto';
import {
  checkUserAdmin,
  OrderSelectList,
  selectOrderDetail,
  selectOrderList,
} from './server-order.util';

@Injectable()
export class ServerOrderService {
  constructor(
    private prisma: PrismaService,
    private therapistQuery: TherapistQuery,
  ) {}
  async findOrderList({
    therapist,
    name,
    email,
    cursor,
    start,
    phone,
    end,
    no,
    gender,
    status,
    cabangId,
    currLim,
  }: OrderSelectList) {
    const select = selectOrderList;
    let items: VOrder[];
    const limit = currLim ? currLim : 10;
    if (!start || !end) {
      return {
        order: [],
        nextCursor: null,
      };
    }
    console.log(start, end);

    if (therapist || name || email || gender || phone || no) {
      items = await this.prisma.order.findMany({
        take: limit,
        where: {
          orderTime: {
            gte: new Date(start),
            lte: new Date(end),
          },

          therapist:
            therapist || no
              ? {
                  nama: therapist
                    ? {
                        startsWith: therapist,
                        mode: 'insensitive',
                      }
                    : undefined,
                  no: no
                    ? {
                        startsWith: no,
                        mode: 'insensitive',
                      }
                    : undefined,
                }
              : undefined,
          guestPhoneNumber: phone
            ? {
                startsWith: phone,
                mode: 'insensitive',
              }
            : undefined,
          cabang: cabangId
            ? {
                id: cabangId,
              }
            : undefined,
          therapistGender: gender ? (gender as Gender) : undefined,
          orderStatus:
            status.length === 0 ? undefined : (status as OrderStatus),
          user:
            name || email
              ? {
                  name: name
                    ? {
                        startsWith: name,
                        mode: 'insensitive',
                      }
                    : undefined,
                  email: email
                    ? {
                        startsWith: email,
                        mode: 'insensitive',
                      }
                    : undefined,
                }
              : undefined,
        },
        select: select,
        orderBy: {
          orderTime: 'asc',
        },
      });

      return {
        order: items,
        nextCursor: null,
      };
    }

    items = await this.prisma.order.findMany({
      take: limit,
      cursor: cursor
        ? {
            id: +cursor,
          }
        : undefined,
      where: {
        orderTime: {
          gte: new Date(start),
          lte: new Date(end),
        },
        cabang: cabangId
          ? {
              id: cabangId,
            }
          : undefined,
        orderStatus: status.length === 0 ? undefined : (status as OrderStatus),
      },
      select: select,
      orderBy: {
        orderTime: 'asc',
      },
    });
    let nextCursor: number | undefined;

    if (items.length < limit) {
      nextCursor = undefined;
    } else {
      nextCursor = items[items.length - 1].id;
    }

    return {
      order: items,
      nextCursor: nextCursor ?? null,
    };
  }

  async findOrderIncome({
    date,
    cabangId,
  }: {
    date?: string;
    cabangId?: number;
  }) {
    let currDate: Date;
    if (!date) {
      currDate = new Date();
    } else {
      currDate = new Date(date);
    }

    const val = formatStringDate(date);
    const prev = {
      start: val.start,
      end: val.end,
    };

    prev.start.setMonth(val.start.getMonth() - 1);
    prev.end.setMonth(val.start.getMonth() - 1);

    const cr = stringDateThisAndNExt(date);

    let res: {
      month: number;
      totalPrice: BigInt;
    }[];
    if (cabangId) {
      res = await this.prisma.$queryRaw<
        { month: number; totalPrice: BigInt }[]
      >`
          select 
            EXTRACT(MONTH from "orderTime") as month,
            sum("totalPrice") as "totalPrice"
          FROM "Order"
          WHERE "orderTime" BETWEEN ${cr.start}::timestamp AND ${cr.end}::timestamp
          and "orderStatus" = 'COMPLETE'::"OrderStatus"
          and "cabangId" = ${cabangId}
          GROUP BY month
          ORDER BY month asc;
        `;
    } else {
      res = await this.prisma.$queryRaw<
        { month: number; totalPrice: BigInt }[]
      >`
          select 
            EXTRACT(MONTH from "orderTime") as month,
            sum("totalPrice") as "totalPrice"
          FROM "Order"
          WHERE "orderTime" BETWEEN ${cr.start}::timestamp AND ${cr.end}::timestamp
          and "orderStatus" = 'COMPLETE'::"OrderStatus"
          
          GROUP BY month
          ORDER BY month asc;
        `;
    }
    const thisMonth = +cr.end.split('-')[1];
    const prevMonth = +cr.start.split('-')[1];

    const arrayToObject = (array: any[], key: any) => {
      const initVal = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item,
        };
      }, initVal);
    };

    const result = arrayToObject(
      res.map((item) => {
        return {
          ...item,
          totalPrice: +item.totalPrice.toString(),
        };
      }),
      'month',
    );

    const monthly = {
      now: result[thisMonth]?.totalPrice ?? 0,
      prev: result[prevMonth]?.totalPrice ?? 0,
    };

    const startWeek = new Date(currDate);
    startWeek.setDate(currDate.getDate() - currDate.getDay() + 1);

    const endWeek = new Date(currDate);
    endWeek.setDate(currDate.getDate() + 6);

    const weekD = getWeekDates(date);
    console.log(weekD);
    type WeekRes = { week: string; totalPrice: BigInt };
    let resultW: WeekRes[];
    if (cabangId) {
      resultW = await this.prisma.$queryRaw<WeekRes[]>`
  SELECT 
    TO_CHAR(DATE_TRUNC('week', "orderTime"), 'YYYY-MM-DD') AS week,
    SUM("totalPrice") AS "totalPrice"
  FROM "Order"
  WHERE "orderTime" BETWEEN ${weekD.startPrev}::timestamp AND ${weekD.endWeek}::timestamp
  and "orderStatus" = 'COMPLETE'::"OrderStatus"
  and "cabangId" = ${cabangId}
  GROUP BY week
  ORDER BY week ASC;
`;
    } else {
      resultW = await this.prisma.$queryRaw<WeekRes[]>`
  SELECT 
    TO_CHAR(DATE_TRUNC('week', "orderTime"), 'YYYY-MM-DD') AS week,
    SUM("totalPrice") AS "totalPrice"
  FROM "Order"
  WHERE "orderTime" BETWEEN ${weekD.startPrev}::timestamp AND ${weekD.endWeek}::timestamp
  and "orderStatus" = 'COMPLETE'::"OrderStatus"
  
  GROUP BY week
  ORDER BY week ASC;
`;
    }

    const resultWS = arrayToObject(
      resultW.map((item) => {
        return {
          ...item,
          week: getWeek(item.week),
          totalPrice: +item.totalPrice.toString(),
        };
      }),
      'week',
    );

    console.log(weekD, 'Here cuy');

    const currs = {
      now: getWeek(weekD.endWeek),
      prev: getWeek(weekD.startPrev),
    };
    console.log(currs);

    const resultWeek = {
      now: resultWS[currs.now]?.totalPrice ?? 0,
      prev: resultWS[currs.prev]?.totalPrice ?? 0,
    };

    return {
      monthly,
      weekly: resultWeek,
    };
  }
  async findOrderDetail(orderId: number) {
    const order: VOrderDetail | null = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      select: selectOrderDetail,
    });
    return {
      order,
    };
  }

  async updateStatusOrder({
    admin,
    body,
    orderId,
  }: {
    orderId: number;
    admin: CurrUser;
    body: UpdateOrderStatusDto;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      select: {
        therapist: {
          select: {
            id: true,
          },
        },
        therapistGender: true,
        orderStatus: true,
        cabangId: true,
        orderTime: true,
      },
    });

    if (!order) {
      throw new ApiException({
        data: 'order_not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const therapist = await this.prisma.therapist.findFirst({
      where: {
        id: body.therapistId,
      },
      select: {
        gender: true,
      },
    });

    if (!therapist) {
      throw new ApiException({
        data: 'therapist_not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }

    if (therapist.gender !== order.therapistGender) {
      throw new ApiException({
        data: 'therapist_gender_wrong',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (order.orderStatus === 'RESCHEDULE') {
      const orderDate = body.orderDate;
      const time = extractTime(body.orderTime);
      // const totalMinutes = countDuration(time);
      orderDate.setHours(time.hour, time.minute, 0, 0);

      const timeslot = await this.therapistQuery.generateTimeSlot({
        cabangId: order.cabangId,
        date: orderDate,
        therapistId: order.therapist.id,
      });

      let exist = false;
      for (let index = 0; index < timeslot.timeSlot.length; index++) {
        const element = timeslot.timeSlot[index];
        if (element === body.orderTime) {
          exist = true;
          break;
        }
      }
      function orderDateG(param: Date) {
        const date = new Date(param);

        return date;
      }

      const orderCompare = order.orderTime.getTime() === orderDate.getTime();
      if (!orderCompare) {
        if (!exist) {
          throw new ApiException({
            data: 'order_time_not_available',
            status: HttpStatus.NOT_FOUND,
          });
        }
      }
      const newTherapist = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          orderTime: orderDateG(orderDate),
          therapist: {
            disconnect: order.therapist
              ? {
                  id: order.therapist.id,
                }
              : undefined,
            connect: {
              id: body.therapistId,
            },
          },
          confirmationTime:
            body.status === OrderStatus.CONFIRMED ? new Date() : undefined,
          orderStatus: body.status,
        },
      });

      return newTherapist;
    }

    const newTherapist = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        therapist: {
          disconnect: order.therapist
            ? {
                id: order.therapist.id,
              }
            : undefined,
          connect: {
            id: body.therapistId,
          },
        },
        confirmationTime:
          body.status === OrderStatus.CONFIRMED ? new Date() : undefined,
        orderStatus: body.status,
      },
    });

    return newTherapist;
  }
}
