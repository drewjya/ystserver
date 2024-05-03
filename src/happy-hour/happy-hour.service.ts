import { HttpStatus, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateHappyHourDto, UpdateHappyHourDto } from './dto/happy-hour.json';

@Injectable()
export class HappyHourService {
  private userQuery: UserQuery;
  constructor(private prisma: PrismaService) {
    this.userQuery = new UserQuery(prisma);
  }

  async create(param: {
    createHappyHourDto: CreateHappyHourDto;
    userId: number;
    cabangId: number;
  }) {
    const { createHappyHourDto, userId, cabangId } = param;
    await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);
    const oldHappyHour = await this.prisma.happyHour.findFirst({
      where: {
        Cabang: {
          every: {
            id: cabangId,
            NOT: {
              deletedAt: null,
            },
          },
        },
      },
    });
    if (oldHappyHour && oldHappyHour.deletedAt) {
      return this.prisma.happyHour.update({
        where: {
          id: oldHappyHour.id,
        },
        data: {
          deletedAt: null,
        },
      });
    }
    if (!oldHappyHour) {
      return this.prisma.happyHour.create({
        data: {
          cabangId: cabangId,
          publicHoliday: createHappyHourDto.publicHoliday,
          happyHourDetail: {
            createMany: {
              data: createHappyHourDto.happyHourDetail,
              skipDuplicates: true,
            },
          },
        },
      });
    }

    throw new ApiException({
      data: 'Happy Hour already exist',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  findAll() {
    return `This action returns all happyHour`;
  }

  findOne(id: number) {
    return `This action returns a #${id} happyHour`;
  }

  async update(param: {
    cabangId: number;
    updateHappyHourDto: UpdateHappyHourDto;
    userId: number;
  }) {
    const { cabangId, updateHappyHourDto, userId } = param;
    await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);

    const happyHour = await this.prisma.happyHour.findFirst({
      where: {
        cabangId: cabangId,

        deletedAt: null,
      },
      include: {
        happyHourDetail: true,
      },
    });

    if (!happyHour || happyHour.deletedAt) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Happy Hour not found',
      });
    }
    return this.prisma.happyHour.update({
      where: {
        id: happyHour.id,
      },
      data: {
        publicHoliday: updateHappyHourDto.publicHoliday,
        happyHourDetail: {
          deleteMany: happyHour.happyHourDetail,
          createMany: {
            data: updateHappyHourDto.happyHourDetail,
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async disable(cabangId: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);
    const happyHour = await this.prisma.happyHour.findFirst({
      where: {
        cabangId: cabangId,

        deletedAt: null,
      },
    });
    console.log(happyHour);

    if (!happyHour) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Happy Hour Already Disabled',
      });
    }
    return this.prisma.happyHour.update({
      where: {
        id: happyHour.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
  async enable(cabangId: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId, [
      Role.ADMIN,
      Role.SUPERADMIN,
    ]);
    const happyHour = await this.prisma.happyHour.findFirst({
      where: {
        cabangId: cabangId,
        NOT: {
          deletedAt: null,
        },
      },
    });
    console.log(happyHour);

    if (!happyHour) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Happy Hour Already Enabled',
      });
    }
    return this.prisma.happyHour.update({
      where: {
        id: happyHour.id,
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
