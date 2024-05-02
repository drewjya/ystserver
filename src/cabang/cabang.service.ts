import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { unlink } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateCabangDto, UpdateCabangDto } from './dto/cabang.dto';

@Injectable()
export class CabangService {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    createCabangDto: CreateCabangDto;
    userId: number;
    file?: Express.Multer.File;
  }) {
    const { createCabangDto, userId } = params;
    const { alamat, closeHour, name, openHour, phoneNumber } = createCabangDto;
    const superadmin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (superadmin.role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }

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
          path: params.file.path,
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

  async findAll() {
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

  async update(param: {
    id: number;
    updateCabangDto: UpdateCabangDto;
    file?: Express.Multer.File;
    userId: number;
  }) {
    const { id, updateCabangDto, userId, file } = param;
    const { alamat, closeHour, name, openHour, phoneNumber } = updateCabangDto;
    const superadmin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (superadmin.role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }

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
      throw new ApiException(HttpStatus.NOT_FOUND, 'cabang not found');
    }

    if (oldBranch.picture && file) {
      await this.prisma.picture.delete({
        where: {
          id: oldBranch.picture.id,
        },
      });
      unlink(oldBranch.picture.path, (err) => {
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
          path: file.path,
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
    const superadmin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (superadmin.role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }

    const oldCabang = await this.prisma.cabang.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!oldCabang) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'cabang not found');
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
