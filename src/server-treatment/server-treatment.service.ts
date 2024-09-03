import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUserAdmin } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { CurrUser, VTreatment } from 'src/utils/types/server.types';
import { CreateTreatmentDto } from './server-treatment.dto';

@Injectable()
export class ServerTreatmentService {
  constructor(private prisma: PrismaService) {}
  async findTreatmentList({
    query,
    cursor,
    category,
    tag,
    limit,
  }: {
    cursor?: number;
    query: string;
    category?: number;
    tag?: number;
    limit: number;
  }) {
    let items: VTreatment[];
    if (query || category || tag) {
      items = await this.prisma.treatment.findMany({
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
          nama: query
            ? {
                startsWith: query,
              }
            : undefined,
          tagsId: tag ? +tag : undefined,
          categoryId: category ? +category : undefined,
        },
        select: {
          id: true,
          nama: true,
          category: {
            select: {
              nama: true,
              id: true,
            },
          },
          durasi: true,
          tags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      return {
        treatment: items,
        nextCursor: null,
      };
    }

    items = await this.prisma.treatment.findMany({
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
        category: {
          select: {
            nama: true,
            id: true,
          },
        },
        durasi: true,
        tags: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    let nextCursor: number | undefined;

    if (items.length < limit) {
      nextCursor = undefined;
    } else {
      nextCursor = items[items.length - 1].id;
    }

    return {
      treatment: items,
      nextCursor: nextCursor ?? null,
    };
  }

  async createTreatment({
    body,
    user,
  }: {
    user: CurrUser;
    body: CreateTreatmentDto;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const treatment = await this.prisma.treatment.create({
      data: {
        nama: body.name,
        durasi: body.durasi,
        category: {
          connect: {
            id: body.category,
          },
        },
        tags: {
          connect: {
            id: body.tag,
          },
        },
      },
    });
    if (treatment) {
      return true;
    }
    throw new ApiException({
      data: 'bad_request_not_created',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  async findTreatmentDetail(treatmentId: number) {
    const treatment: VTreatment = await this.prisma.treatment.findFirst({
      where: {
        id: treatmentId,
      },
      select: {
        id: true,
        category: {
          select: {
            id: true,
            nama: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        nama: true,
        durasi: true,
      },
    });
    if (!treatment) {
      throw new ApiException({
        data: 'not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return treatment;
  }

  async editTreatment({
    body,
    user,
    treatmentId,
  }: {
    user: CurrUser;
    body: CreateTreatmentDto;
    treatmentId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const treatment = await this.prisma.treatment.update({
      where: {
        id: treatmentId,
      },
      data: {
        nama: body.name,
        durasi: body.durasi,
        category: {
          connect: {
            id: body.category,
          },
        },
        tags: {
          connect: {
            id: body.tag,
          },
        },
      },
    });
    if (treatment) {
      return true;
    }
    throw new ApiException({
      data: 'bad_request_not_created',
      status: HttpStatus.BAD_REQUEST,
    });
  }

  async deleteTreatment({
    user,
    treatmentId,
  }: {
    user: CurrUser;
    treatmentId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });
    const treatment = await this.prisma.treatment.delete({
      where: {
        id: treatmentId,
      },
    });
    if (treatment) {
      return true;
    }
    throw new ApiException({
      data: 'bad_request_not_deleted',
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
