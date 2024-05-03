import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class TherapistQuery {
  private prisma: PrismaService;
  constructor(_prisma: PrismaService) {
    this.prisma = _prisma;
  }

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
}
