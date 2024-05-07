import { HttpStatus, Injectable } from '@nestjs/common';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateTreatmentDto, UpdateTreatmentDto } from './dto/treatment.dto';

@Injectable()
export class TreatmentService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
  ) {}

  async create(params: {
    createTreatmentDto: CreateTreatmentDto;
    userId: number;
  }) {
    await this.userQuery.findSuperAdminUnique(params.userId);
    const treatment = await this.prisma.treatment.findFirst({
      where: {
        nama: params.createTreatmentDto.nama,
        NOT: {
          deletedAt: null,
        },
      },
    });

    if (treatment) {
      const update = await this.prisma.treatment.update({
        data: {
          deletedAt: null,
          category: {
            connect: {
              id: params.createTreatmentDto.categoryId,
            },
          },
        },
        include: {
          category: true,
        },
        where: {
          id: treatment.id,
        },
      });
      return {
        id: update.id,
        nama: update.nama,
        durasi: update.durasi,
        category: {
          nama: update.category.nama,
          id: update.category.id,
        },
      };
    }

    const newTreatment = await this.prisma.treatment.create({
      data: {
        durasi: params.createTreatmentDto.durasi,
        nama: params.createTreatmentDto.nama,
        category: {
          connect: {
            id: params.createTreatmentDto.categoryId,
          },
        },
      },
      include: {
        category: true,
      },
    });
    return {
      id: newTreatment.id,
      durasi: newTreatment.durasi,
      nama: newTreatment.nama,
      category: {
        nama: newTreatment.category.nama,
        id: newTreatment.category.id,
      },
    };
  }

  findAll() {
    return this.prisma.treatment.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        nama: true,
        durasi: true,
        category: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.treatment.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        nama: true,
        durasi: true,
        category: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }

  async update(params: {
    id: number;
    updateTreatmentDto: UpdateTreatmentDto;
    userId: number;
  }) {
    const { id, updateTreatmentDto, userId } = params;
    await this.userQuery.findSuperAdminUnique(userId);
    const treatment = await this.prisma.treatment.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!treatment) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Treatment not found',
      });
    }

    return this.prisma.treatment.update({
      data: {
        durasi: updateTreatmentDto.durasi,
        nama: updateTreatmentDto.nama,
        category: {
          connect: {
            id: updateTreatmentDto.categoryId,
          },
        },
      },
      select: {
        id: true,
        nama: true,
        durasi: true,
        category: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
    const treatment = await this.prisma.treatment.findFirst({
      where: {
        id: id,
        deletedAt: null,
      },
    });

    if (!treatment) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Treatment not found',
      });
    }

    return this.prisma.treatment.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
      select: {
        id: true,
        durasi: true,
        nama: true,
        category: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
  }
}
