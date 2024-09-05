import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { bad_request, checkUserAdmin, not_found, unauthorized } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import {
  CurrUser,
  VTherapist,
  VTherapistDetail,
} from 'src/utils/types/server.types';
import { CreateTherapistDto } from './server-therapist.dto';
import { VDate } from 'src/utils/date/timezone.date';

export const getUtcDateToday = () => {
  const localDate = new Date();

  const formattedDate = localDate
    .toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/');

  const jakartaStartDate = new Date(
    `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`,
  );

  const jakartaEndDate = new Date(jakartaStartDate);
  jakartaEndDate.setDate(jakartaEndDate.getDate() + 1);
  jakartaEndDate.setMilliseconds(jakartaEndDate.getMilliseconds() - 1);

  const utcStart = jakartaStartDate.toISOString();
  const utcEnd = jakartaEndDate.toISOString();

  return {
    start: utcStart,
    end: utcEnd,
  };
};

@Injectable()
export class ServerTherapistService {
  constructor(private prisma: PrismaService) {}
  async findTherapistList({
    cursor,
    query,
    gender,
    no,
    cabang,
    limit: lim,
    hasCabang,
  }: {
    cursor: number;
    query: string;
    gender: string;
    no: string;
    cabang: number;
    limit: number;
    hasCabang?: string;
  }) {
    const limit = lim ? lim : 10;
    let items: VTherapist[];
    const date = getUtcDateToday();
    if (query || gender || no || cabang || hasCabang) {
      const data = await this.prisma.therapist.findMany({
        take: limit,
        ...(parseInt(`${cursor}`)
          ? {
              skip: 1, // Do not include the cursor itself in the query result.
              cursor: {
                id: +cursor,
              },
            }
          : {}),
        where: {
          no: no
            ? {
                startsWith: no,
                mode: 'insensitive',
              }
            : undefined,
          cabang:
            cabang && !hasCabang
              ? {
                  id: +cabang,
                }
              : undefined,

          cabangId: hasCabang ? null : undefined,
          gender: gender ? (gender as Gender) : undefined,
          nama: query
            ? {
                startsWith: query,
                mode: 'insensitive',
              }
            : undefined,
        },
        select: {
          id: true,
          nama: true,
          no: true,
          cabang: {
            select: {
              nama: true,
              id: true,
            },
          },
          gender: true,
          attendance: {
            select: {
              checkIn: true,
              checkOut: true,
              id: true,
            },
            take: 1,
            where: {
              createdAt: {
                gte: date.start,
                lt: date.end,
              },
            },
          },
        },
      });
      let nextCursor: number | undefined;
      items = data.map((e) => {
        return {
          ...e,
          attendance: e.attendance.length > 0 ? e.attendance[0] : undefined,
        };
      });
      if (items.length < limit) {
        nextCursor = undefined;
      } else {
        nextCursor = items[items.length - 1].id;
      }

      return {
        therapist: items,
        nextCursor: nextCursor,
      };
    }

    const data = await this.prisma.therapist.findMany({
      take: limit,
      ...(parseInt(`${cursor}`)
        ? {
            skip: 1, // Do not include the cursor itself in the query result.
            cursor: {
              id: +cursor,
            },
          }
        : {}),

      select: {
        id: true,
        nama: true,
        no: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
        gender: true,
        attendance: {
          select: {
            checkIn: true,
            checkOut: true,
            id: true,
          },
          take: 1,
          where: {
            createdAt: {
              gte: date.start,
              lt: date.end,
            },
          },
        },
      },
    });
    let nextCursor: number | undefined;
    items = data.map((e) => {
      return {
        ...e,
        attendance: e.attendance.length > 0 ? e.attendance[0] : undefined,
      };
    });
    if (items.length < limit) {
      nextCursor = undefined;
    } else {
      nextCursor = items[items.length - 1].id;
    }

    return {
      therapist: items,
      nextCursor: nextCursor ?? null,
    };
  }

  async createTherapist({
    body,
    user,
  }: {
    body: CreateTherapistDto;
    user: CurrUser;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      userId: +user.id,
      role: 'SUPERADMIN',
    });
    const therapist = await this.prisma.therapist.create({
      data: {
        gender: body.gender,
        nama: body.name,
        no: body.no,
        TherapistSkillTag: {
          create: body.skillTags.map((e) => {
            return {
              tags: {
                connect: {
                  id: e,
                },
              },
            };
          }),
        },
        cabang: body.cabang
          ? {
              connect: {
                id: body.cabang,
              },
            }
          : undefined,
      },
    });
    if (therapist) {
      return true;
    }
    throw new ApiException({
      data: 'bad_request_not_created',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  async editTherapist({
    body,
    user,
    therapistId,
  }: {
    body: CreateTherapistDto;
    user: CurrUser;
    therapistId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      userId: +user.id,
      role: 'SUPERADMIN',
    });
    const oldTherapis = await this.prisma.therapist.findFirst({
      where: {
        id: therapistId,
      },
      select: {
        TherapistSkillTag: true,
      },
    });
    const therapist = await this.prisma.therapist.update({
      where: {
        id: therapistId,
      },
      data: {
        gender: body.gender,
        nama: body.name,
        no: body.no,
        TherapistSkillTag: {
          delete: oldTherapis.TherapistSkillTag.map((e) => {
            return {
              therapistId_tagsId: {
                therapistId: therapistId,
                tagsId: e.tagsId,
              },
            };
          }),
          create: body.skillTags.map((e) => {
            return {
              tags: {
                connect: {
                  id: e,
                },
              },
            };
          }),
        },
        cabang: body.cabang
          ? {
              connect: {
                id: body.cabang,
              },
            }
          : undefined,
      },
    });
    if (therapist) {
      return true;
    }
    throw new ApiException({
      data: 'bad_request_not_created',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  async deleteTherapist({
    user,

    therapistId,
  }: {
    user: CurrUser;

    therapistId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const deleteUser = await this.prisma.therapist.delete({
      where: {
        id: therapistId,
      },
    });
    if (!deleteUser) {
      throw new ApiException({
        data: 'not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return true;
  }

  async findTherapistDetail({
    user,
    therapistId,
  }: {
    user: CurrUser;
    therapistId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      userId: +user.id,
      role: ['ADMIN', 'SUPERADMIN'],
    });

    const therapist: VTherapistDetail = await this.prisma.therapist.findFirst({
      where: {
        id: therapistId,
      },
      select: {
        nama: true,
        no: true,
        cabang: {
          select: {
            id: true,
            nama: true,
            phoneNumber: true,
            closeHour: true,
            openHour: true,
            picture: {
              select: {
                path: true,
              },
            },
            alamat: true,
          },
        },
        gender: true,
        TherapistSkillTag: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (therapist) {
      return therapist;
    }
    throw new ApiException({
      data: 'not_found',
      status: HttpStatus.NOT_FOUND,
    });
  }


  async checkInTherapist(param: {
    therapistId: number;
    cabangId?: number;
    admin: CurrUser;
    type: 'check-in' | 'check-out';
  }) {
    const admin = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +param.admin.id,
    });
    const date = getUtcDateToday();
    const therapist = await this.prisma.therapist.findFirst({
      where: {
        id: param.therapistId,
      },
      select: {
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
        attendance: {
          select: {
            checkIn: true,
            checkOut: true,
            id: true,
          },
          take: 1,
          where: {
            createdAt: {
              gte: date.start,
              lt: date.end,
            },
          },
        },
      },
    });

    if (!therapist) {
      throw not_found;
    }
    if (
      admin.role === 'ADMIN' &&
      admin.adminCabang?.id !== therapist.cabang.id
    ) {
      throw unauthorized;
    }
    if (therapist.attendance.length !== 0 && param.type === 'check-in') {
      throw bad_request;
    }
    if (therapist.attendance.length === 0 && param.type === 'check-out') {
      throw bad_request;
    }

    if (param.type === 'check-out') {
      const attendance = therapist.attendance[0];
      if (attendance.checkOut || !attendance.checkIn) {
        throw bad_request;
      }
      await this.prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: {
          checkOut: VDate.now(),
        },
      });
      return true;
    }
    if (param.type === 'check-in') {
      const attendance = therapist.attendance[0];
      if (attendance) {
        throw bad_request;
      }
      await this.prisma.attendance.create({
        data: {
          therapist: {
            connect: {
              id: param.therapistId,
            },
          },
          checkIn: VDate.now(),
        },
      });
      return true;
    }
  }
}
