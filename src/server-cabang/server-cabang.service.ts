import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { addStoragePath, removeStoragePath } from 'src/config/upload.config';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  bad_request,
  checkUserAdmin,
  not_found,
} from 'src/server-order/server-order.util';
import { CurrUser, VCabang } from 'src/utils/types/server.types';
import { CreateCabangDto } from './server-cabang.dto';

@Injectable()
export class ServerCabangService {
  constructor(private prisma: PrismaService) {}
  async findCabangList({
    limit,
    cursor,
    query,
  }: {
    cursor?: number;
    limit: number;
    query?: string;
  }) {
    let cabang: VCabang[];
    if (query) {
      cabang = await this.prisma.cabang.findMany({
        take: limit ? +limit : undefined,
        where: {
          nama: {
            startsWith: query,
            mode: 'insensitive',
          },
        },

        orderBy: {
          createdAt: 'desc',
        },
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
      });
    } else {
      cabang = await this.prisma.cabang.findMany({
        take: limit ? +limit : undefined,
        ...(parseInt(`${cursor}`)
          ? {
              skip: 1, // Do not include the cursor itself in the query result.
              cursor: {
                id: +cursor,
              },
            }
          : {}),

        orderBy: {
          createdAt: 'desc',
        },
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
      });
    }

    let nextCursor: number | undefined;

    if (cabang.length < limit) {
      nextCursor = undefined;
    } else {
      nextCursor = cabang[cabang.length - 1].id;
    }

    return {
      cabang: cabang,
      nextCursor: nextCursor,
    };
  }

  async createCabang({
    body,
    user,
    file,
  }: {
    file?: Express.Multer.File;
    body: CreateCabangDto;
    user: CurrUser;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const cabang = await this.prisma.cabang.create({
      data: {
        nama: body.name,
        alamat: body.alamat,
        phoneNumber: body.phoneNumber,
        closeHour: body.closeHour,
        openHour: body.openHour,
        picture: file
          ? {
              create: {
                path: removeStoragePath(file.path),
              },
            }
          : undefined,
      },
    });
    if (!cabang) {
      throw bad_request;
    }
    const happyHour = await this.prisma.happyHour.create({
      data: {
        cabangId: cabang.id,
        cabang: {
          connect: {
            id: cabang.id,
          },
        },
        happyHourDetail: {
          createMany: {
            data: body.detail.map((e) => {
              return {
                endDay: e.endDay,
                endHour: e.endHour,
                startDay: e.startDay,
                startHour: e.startHour,
              };
            }),
          },
        },
      },
    });
    if (!happyHour) {
      throw bad_request;
    }
    return true;
  }

  async deleteCabang({ cabangId, user }: { cabangId: number; user: CurrUser }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const data = await this.prisma.cabang.delete({
      where: {
        id: cabangId,
      },
      select: {
        picture: {
          select: {
            path: true,
          },
        },
      },
    });
    if (!data) {
      throw not_found;
    }
    unlink(addStoragePath(data.picture.path), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    return true;
  }
}
