import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUserAdmin } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { VTherapist } from 'src/utils/types/server.types';
import { CreateTherapistDto } from './server-therapist.dto';

const getUtcDateToday = () => {
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
  }: {
    cursor: number;
    query: string;
    gender: string;
    no: string;
    cabang: number;
    limit: number;
  }) {
    const limit = lim ? lim : 10;
    let items: VTherapist[];
    const date = getUtcDateToday();
    if (query || gender || no || cabang) {
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
          cabang: cabang
            ? {
                id: +cabang,
              }
            : undefined,
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
    user: {
      role: string;
      id: string;
    };
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
    user: {
      role: string;
      id: string;
    };

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
}
