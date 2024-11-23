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
          happyHour: {
            select: {
              publicHoliday: true,
              happyHourDetail: {
                select: {
                  endDay: true,
                  endHour: true,
                  startDay: true,
                  startHour: true,
                },
              },
            },
          },
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
          happyHour: {
            select: {
              publicHoliday: true,
              happyHourDetail: {
                select: {
                  endDay: true,
                  endHour: true,
                  startDay: true,
                  startHour: true,
                },
              },
            },
          },
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
    try {
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
          vipRoom: body.vip_room
            ? {
                create: {
                  ninety_minute: body.vip_room.ninety_minute,
                  one_twenty_minute: body.vip_room.one_twenty_minute,
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
          publicHoliday: body.publicHoliday === 'true',
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
    } catch (error) {
      unlink(addStoragePath(file.path), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
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
        happyHourId: true,
        picture: {
          select: {
            path: true,
          },
        },
      },
    });
    console.log(data);

    if (!data) {
      throw not_found;
    }
    if (data.happyHourId) {
      const old = await this.prisma.happyHour.delete({
        where: {
          id: data.happyHourId,
        },
      });
    }
    if (data.picture) {
      unlink(addStoragePath(data.picture.path), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
    return true;
  }

  async editCabang({
    body,
    user,
    file,
    cabangId,
  }: {
    cabangId: number;
    file?: Express.Multer.File;
    body: CreateCabangDto;
    user: CurrUser;
  }) {
    try {
      await checkUserAdmin({
        prisma: this.prisma,
        role: 'SUPERADMIN',
        userId: +user.id,
      });

      const oldCabang = await this.prisma.cabang.findFirst({
        where: {
          id: cabangId,
        },
        select: {
          picture: {
            select: {
              id: true,
              path: true,
            },
          },
          happyHour: true,
        },
      });

      if (!oldCabang) {
        throw not_found;
      }
      if (oldCabang.picture) {
        unlink(addStoragePath(oldCabang.picture.path), (e) => {
          if (e) {
            console.log(e);
          }
        });
      }

      const cabang = await this.prisma.cabang.update({
        where: {
          id: cabangId,
        },

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
                disconnect: oldCabang.picture
                  ? {
                      id: oldCabang.picture.id,
                    }
                  : undefined,
              }
            : undefined,
        },
      });
      if (!cabang) {
        throw bad_request;
      }
      if (cabang.vIPRoomId) {
        const old = await this.prisma.vIPRoom.delete({
          where: {
            id: cabang.vIPRoomId,
          },
        });
        if (body.vip_room) {
          const vip = await this.prisma.vIPRoom.create({
            data: {
              Cabang: {
                connect: {
                  id: cabangId,
                },
              },
              ninety_minute: body.vip_room.ninety_minute,
              one_twenty_minute: body.vip_room.one_twenty_minute,
            },
          });
        }
      }

      if (cabang.happyHourId) {
        const old = await this.prisma.happyHour.delete({
          where: {
            id: cabang.happyHourId,
          },
        });
      }
      console.log(body.publicHoliday, 'PUBLIC HOLIDAY');

      const happyHour = await this.prisma.happyHour.create({
        data: {
          cabangId: cabang.id,
          cabang: {
            connect: {
              id: cabang.id,
            },
          },
          publicHoliday: body.publicHoliday === 'true',
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
    } catch (error) {
      unlink(addStoragePath(file.path), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }

  async findCabangForm(cabangId: number) {
    const cabang = await this.prisma.cabang.findFirst({
      where: {
        id: cabangId,
      },
      select: {
        nama: true,
        id: true,
        alamat: true,
        phoneNumber: true,
        closeHour: true,
        openHour: true,
        picture: {
          select: {
            id: true,
            path: true,
          },
        },
        happyHour: {
          select: {
            id: true,
            publicHoliday: true,
            happyHourDetail: {
              select: {
                id: true,
                endDay: true,
                endHour: true,
                startDay: true,
                startHour: true,
              },
            },
          },
        },
      },
    });
    if (cabang) {
      return cabang;
    }
    throw not_found;
  }
}
