import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VDate } from 'src/utils/date/timezone.date';
import { ApiException } from 'src/utils/exception/api.exception';
import { extractTime, timeToString } from 'src/utils/extract/time.extract';
@Injectable()
export class TherapistQuery {
  constructor(private prisma: PrismaService) { }

  get selectTherapistBasic(): Prisma.TherapistSelect {
    return {
      id: true,
      nama: true,
      gender: true,
      no: true,
      cabang: {
        select: {
          nama: true,
          id: true,
        },
      },
    };
  }

  get selectTherapistWithAttendance(): Prisma.TherapistSelect {
    const date = VDate.getUtcDateToday();

    return {
      id: true,
      nama: true,
      no: true,
      gender: true,
      attendance: {
        take: 1,
        where: {
          createdAt: {
            gte: date.start,
            lt: date.end,
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
    const date = VDate.getUtcDateToday();
    return {
      id: true,
      nama: true,
      gender: true,
      attendance: {
        take: 1,
        where: {
          createdAt: {
            gte: date.start,
            lt: date.end,
          },
        },
      },
      rating: {
        select: {
          point: true,
        },
      },
      TherapistSkillTag: {
        select: {

          tags: {
            select: {
              id: true,
              name: true,
              Treatment: {
                select: {
                  nama: true,
                  id: true,
                  durasi: true,
                  category: {
                    select: {
                      nama: true,
                      optional: true,
                      happyHourPrice: true,
                      id: true,
                    }
                  }
                }
              }
            }
          }
        }
      },
      therapistTreatment: {
        select: {
          treatment: {
            select: {
              nama: true,
              id: true,
              durasi: true,
              category: {
                select: {
                  nama: true,
                  optional: true,
                  happyHourPrice: true,
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
    for (let i = timeOpen.hour; i <= timeClose.hour; i += 2) {
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
      const dateString = VDate.getUtcDateForTimeSlot(date);

      const order = await this.prisma.order.findMany({
        where: {
          therapistId: therapistId,
          cabangId: cabangId,
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
