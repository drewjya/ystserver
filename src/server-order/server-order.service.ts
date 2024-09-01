import { Injectable } from '@nestjs/common';
import { Gender, OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VOrder, VOrderDetail } from 'src/utils/types/server.types';
import { OrderSelectList, selectOrderDetail, selectOrderList } from './server-order.util';
import { formatStringDate, getWeek, getWeekDates, stringDateThisAndNExt } from 'src/config/format';

@Injectable()
export class ServerOrderService {
    constructor(private prisma: PrismaService) { }
    async findOrderList(
        {
            therapist,
            name,
            email,
            cursor,
            start,
            phone,
            end,
            gender,
            status,
            cabangId,
        }: OrderSelectList
    ) {
        const select = selectOrderList
        let items: VOrder[];
        const limit = 10;
        if (!start || !end) {
            return {
                order: [],
                nextCursor: null,
            }
        }
        if (therapist || name || email || gender || phone) {
            items = await this.prisma.order.findMany({
                take: limit,
                where: {
                    orderTime: {
                        gte: new Date(start),
                        lte: new Date(end),
                    },
                    therapist: therapist
                        ? {
                            nama: {
                                startsWith: therapist,
                                mode: "insensitive",
                            },
                        }
                        : undefined,
                    guestPhoneNumber: phone
                        ? {
                            startsWith: phone,
                            mode: "insensitive",
                        }
                        : undefined,
                    cabang: cabangId ? {
                        id: cabangId
                    } : undefined,
                    therapistGender: gender ? (gender as Gender) : undefined,
                    orderStatus: status.length === 0 ? undefined : (status as OrderStatus),
                    user:
                        name || email
                            ? {
                                name: name
                                    ? {
                                        startsWith: name,
                                        mode: "insensitive",
                                    }
                                    : undefined,
                                email: email
                                    ? {
                                        startsWith: email,
                                        mode: "insensitive",
                                    }
                                    : undefined,
                            }
                            : undefined,
                },
                select: select,
                orderBy: {
                    orderTime: "asc",
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
                cabang: cabangId ? {
                    id: cabangId
                } : undefined,
                orderStatus: status.length === 0 ? undefined : (status as OrderStatus),
            },
            select: select,
            orderBy: {
                orderTime: "asc",
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


    async findOrderIncome(
        {date, cabangId}:{date?:string, cabangId?:number}
    ) {
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
        
      
        const res = await this.prisma.$queryRaw<{ month: number; totalPrice: BigInt }[]>`
          select 
            EXTRACT(MONTH from "orderTime") as month,
            sum("totalPrice") as "totalPrice"
          FROM "Order"
          WHERE "orderTime" BETWEEN ${cr.start}::timestamp AND ${cr.end}::timestamp
          and "orderStatus" = 'COMPLETE'::"OrderStatus"
          ${cabangId ?`AND "cabangId" = ${cabangId}`:''}
          GROUP BY month
          ORDER BY month asc;
        `;
        const thisMonth = +cr.end.split("-")[1];
        const prevMonth = +cr.start.split("-")[1];
      
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
          "month"
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
      
        const resultW = await this.prisma.$queryRaw<
          { week: string; totalPrice: BigInt }[]
        >`
          SELECT 
            TO_CHAR(DATE_TRUNC('week', "orderTime"), 'YYYY-MM-DD') AS week,
            SUM("totalPrice") AS "totalPrice"
          FROM "Order"
          WHERE "orderTime" BETWEEN ${weekD.startPrev}::timestamp AND ${weekD.endWeek}::timestamp
          and "orderStatus" = 'COMPLETE'::"OrderStatus"
          ${cabangId ?`AND "cabangId" = ${cabangId}`:''}
          GROUP BY week
          ORDER BY week ASC;
        `;
      
        const resultWS = arrayToObject(
          resultW.map((item) => {
            return {
              ...item,
              week: getWeek(item.week),
              totalPrice: +item.totalPrice.toString(),
            };
          }),
          "week"
        );
      
        const currs = {
          now: getWeek(weekD.endWeek),
          prev: getWeek(weekD.startPrev),
        };
      
      
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
}
