import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { unlink } from 'fs';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { addStoragePath, removeStoragePath } from '../config/upload.config';
import { CreateCabangDto, UpdateCabangDto } from './dto/cabang.dto';

@Injectable()
export class CabangService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
  ) {}

  async create(params: {
    createCabangDto: CreateCabangDto;
    userId: number;
    file?: Express.Multer.File;
  }) {
    const { createCabangDto, userId } = params;
    const { alamat, closeHour, name, openHour, phoneNumber } = createCabangDto;
    await this.userQuery.findSuperAdminUnique(userId);

    let data: Prisma.CabangCreateInput = {
      alamat: alamat,
      closeHour: closeHour,
      nama: name,
      openHour: openHour,
      phoneNumber: phoneNumber,
    };
    if (params.file) {
      data.picture = {
        create: {
          path: removeStoragePath(params.file.path),
        },
      };
    }
    const branch = await this.prisma.cabang.create({
      data: data,
      include: {
        picture: true,
      },
    });

    return {
      id: branch.id,
      alamat: branch.alamat,
      closeHour: branch.closeHour,
      nama: branch.nama,
      openHour: branch.openHour,
      phoneNumber: branch.phoneNumber,
      picture: branch.picture?.path ?? null,
    };
  }

  async findAll(limit?: number) {
    let data = {};
    if (limit) {
      data = {
        take: limit,
      };
    }
    const req = await this.prisma.cabang.findMany({
      include: {
        picture: true,
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
        happyHour: {
          select: {
            happyHourDetail: true,
            publicHoliday: true,
          },
        },
      },
      where: {
        deletedAt: null,
      },
      ...data,
    });

    return req.map((val) => {
      return {
        id: val.id,
        alamat: val.alamat,
        closeHour: val.closeHour,
        nama: val.nama,
        openHour: val.openHour,
        phoneNumber: val.phoneNumber,
        picture: val.picture?.path ?? null,
        admin: val.admin,
        happyHour: val.happyHour,
      };
    });
  }

  async findOne(id: number) {
    const val = await this.prisma.cabang.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        picture: true,
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
        happyHour: {
          select: {
            happyHourDetail: true,
            publicHoliday: true,
          },
        },
      },
    });
    return {
      id: val.id,
      alamat: val.alamat,
      closeHour: val.closeHour,
      nama: val.nama,
      openHour: val.openHour,
      phoneNumber: val.phoneNumber,
      picture: val.picture?.path ?? null,
      admin: val.admin,
      happyHour: val.happyHour,
    };
  }

  async findByCategory(categoryName: string) {
    const cabang = await this.prisma.category.findUnique({
      where: {
        nama: categoryName,
      },
      select: {
        Treatment: {
          select: {
            treatmentCabang: {
              select: {
                cabang: {
                  select: {
                    id: true,
                    alamat: true,
                    closeHour: true,
                    nama: true,
                    openHour: true,
                    phoneNumber: true,
                    picture: {
                      select: {
                        path: true,
                      },
                    },
                    admin: true,
                    happyHour: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cabang) {
      return [];
    }

    const branchMap = new Map();
    cabang.Treatment.forEach((treatment) => {
      treatment.treatmentCabang.forEach((treatmentCabang) => {
        const val = treatmentCabang.cabang;
        if (!branchMap.has(val.id)) {
          branchMap.set(val.id, {
            id: val.id,
            alamat: val.alamat,
            closeHour: val.closeHour,
            nama: val.nama,
            openHour: val.openHour,
            phoneNumber: val.phoneNumber,
            picture: val.picture?.path ?? null,
            admin: val.admin,
            happyHour: val.happyHour,
          });
        }
      });
    });

    return Array.from(branchMap.values());
  }

  async update(param: {
    id: number;
    updateCabangDto: UpdateCabangDto;
    file?: Express.Multer.File;
    userId: number;
  }) {
    const { id, updateCabangDto, userId, file } = param;
    const { alamat, closeHour, name, openHour, phoneNumber } = updateCabangDto;
    await this.userQuery.findSuperAdminUnique(userId);
    const oldBranch = await this.prisma.cabang.findUnique({
      where: {
        deletedAt: null,
        id: id,
      },
      include: {
        picture: true,
      },
    });

    if (!oldBranch) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'cabang not found',
      });
    }

    if (oldBranch.picture && file) {
      await this.prisma.picture.delete({
        where: {
          id: oldBranch.picture.id,
        },
      });
      unlink(addStoragePath(oldBranch.picture.path), (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    let data: Prisma.CabangUpdateInput = {
      alamat: alamat,
      closeHour: closeHour,
      nama: name,
      openHour: openHour,
      phoneNumber: phoneNumber,
    };
    if (file) {
      data.picture = {
        create: {
          path: removeStoragePath(file.path),
        },
      };
    }
    const branch = await this.prisma.cabang.update({
      data: data,
      where: {
        id: id,
      },
      include: {
        picture: true,
      },
    });

    return {
      id: branch.id,
      alamat: branch.alamat,
      closeHour: branch.closeHour,
      nama: branch.nama,
      openHour: branch.openHour,
      phoneNumber: branch.phoneNumber,
      picture: branch.picture?.path ?? null,
    };
  }

  async remove(id: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
    const oldCabang = await this.prisma.cabang.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!oldCabang) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'cabang not found',
      });
    }

    const val = await this.prisma.cabang.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        picture: true,
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
          },
        },
        happyHour: {
          select: {
            happyHourDetail: true,
            publicHoliday: true,
          },
        },
      },
    });

    return {
      id: val.id,
      alamat: val.alamat,
      closeHour: val.closeHour,
      nama: val.nama,
      openHour: val.openHour,
      phoneNumber: val.phoneNumber,
      picture: val.picture?.path ?? null,
      admin: val.admin,
      happyHour: val.happyHour,
    };
  }
}
