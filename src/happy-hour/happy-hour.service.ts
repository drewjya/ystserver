import { HttpStatus, Injectable } from '@nestjs/common';
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

  update(id: number, updateHappyHourDto: UpdateHappyHourDto) {
    return `This action updates a #${id} happyHour`;
  }

  remove(id: number) {
    return `This action removes a #${id} happyHour`;
  }
}
