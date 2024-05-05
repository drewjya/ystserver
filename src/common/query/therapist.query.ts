import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { dateFormat } from 'src/config/format';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { extractTime, timeToString } from 'src/utils/extract/time.extract';
@Injectable()
export class TherapistQuery {
  constructor(private prisma: PrismaService) {}

  get selectTherapistBasic(): Prisma.TherapistSelect {
    return {
      id: true,
      nama: true,
      gender: true,
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
    };
  }

  get selectTherapistWithAttendance(): Prisma.TherapistSelect {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      id: true,
      nama: true,
      gender: true,
      attendance: {
        take: 1,
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
    };
  }

  get selectTherapistWithTreatment(): Prisma.TherapistSelect {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      id: true,
      nama: true,
      gender: true,
      attendance: {
        take: 1,
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      rating: {
        select: {
          point: true,
        },
      },
      therapistTreatment: {
        select: {
          treatment: {
            select: {
              nama: true,
              id: true,
              category: {
                select: {
                  nama: true,
                  id: true,
                },
              },
            },
          },
        },
      },
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
    };
  }

  async generateTimeSlot(param: {
    cabangId: number;
    date: Date;

    therapistId?: number;
  }) {
    const { cabangId, therapistId, date } = param;

    const cabang = await this.prisma.cabang.findUnique({
      where: {
        id: cabangId,
        deletedAt: null,
      },
    });

    if (!cabang) {
      throw new ApiException({
        data: 'Cabang tidak ditemukan',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const timeOpen = extractTime(cabang.openHour);
    const timeClose = extractTime(cabang.closeHour);

    console.log(`time-close ${timeClose.hour}`);

    let timeSlot: string[] = [];
    for (let i = timeOpen.hour; i < timeClose.hour; i += 2) {
      timeSlot.push(`${timeToString(i)}:${timeToString(timeOpen.minute)}:00`);
    }

    if (therapistId) {
      const therapist = await this.prisma.therapist.findUnique({
        where: {
          id: therapistId,
          deletedAt: null,
          cabangId: cabangId,
        },
      });
      if (!therapist) {
        throw new ApiException({
          data: 'Therapist tidak ditemukan',
          status: HttpStatus.NOT_FOUND,
        });
      }
      const dateString = dateFormat(date, 'YYYY-MM-DD');
      console.log(dateString, 'DATE');

      const order = await this.prisma.order.findMany({
        where: {
          therapistId: therapistId,
          cabangId: cabangId,
          orderTime: {
            gte: `${dateString}T00:00:00.000Z`,
            lt: `${dateString}T23:59:59.000Z`,
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

      console.log(timeSlot);
      let timeNotAllowed = new Set<string>();
      if (order.length > 0) {
        order.forEach((o) => {
          const orderTime = o.orderTime.getHours();

          const durasi = o.orderDetails.reduce((acc, curr) => {
            return acc + curr.treatment.durasi;
          }, 0);

          const hours = Math.floor(durasi / 60);
          const timeFInish = orderTime + hours;

          for (const iterator of timeSlot) {
            const time = extractTime(iterator);

            if (time.hour >= orderTime && time.hour < timeFInish) {
              timeNotAllowed.add(iterator);
            }
          }
          console.log(timeNotAllowed);
        });
        timeSlot = timeSlot.filter((time) => {
          return timeNotAllowed.has(time) === false;
        });
      }
    }
    console.log(timeSlot);

    return {
      timeSlot,
      timeOpen: cabang.openHour,
      timeClose: cabang.closeHour,
    };
  }
}
