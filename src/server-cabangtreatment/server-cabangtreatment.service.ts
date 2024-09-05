import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  checkUserAdmin,
  duplicate,
  not_found,
  unauthorized,
} from 'src/server-order/server-order.util';
import { CreateCabangTreatmentDto } from 'src/server-treatment/server-treatment.dto';
import { CurrUser, VCabangTreatment } from 'src/utils/types/server.types';

@Injectable()
export class ServerCabangtreatmentService {
  constructor(private prisma: PrismaService) {}

  async findCabangTreatmentList(param: {
    cabangId?: number;
    user: CurrUser;
    cursor?: number;
    query: string;
    category?: number;
    tag?: number;
    limit: number;
  }) {
    const { limit, query, user, cabangId, category, cursor, tag } = param;
    console.log(param);

    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +user.id,
    });
    console.log(`CABANG ${JSON.stringify(data)} ${cabangId}`);
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ? cabangId : data.adminCabang.id;

    const treatments: VCabangTreatment[] =
      await this.prisma.treatmentCabang.findMany({
        take: limit,
        ...(parseInt(`${cursor}`)
          ? {
              skip: 1, // Do not include the cursor itself in the query result.
              cursor: {
                cabangId_treatmentId: {
                  cabangId: cabangID,
                  treatmentId: +cursor,
                },
              },
            }
          : {}),
        where: {
          cabangId: cabangID,
          treatment:
            query || category || tag
              ? {
                  categoryId: category ? category : undefined,
                  tagsId: tag ? tag : undefined,
                  nama: query
                    ? {
                        startsWith: query,
                        mode: 'insensitive',
                      }
                    : undefined,
                }
              : undefined,
        },

        select: {
          price: true,
          happyHourPrice: true,
          treatment: {
            select: {
              nama: true,
              id: true,
              durasi: true,
              category: {
                select: {
                  nama: true,
                  id: true,
                  optional: true,
                  happyHourPrice: true,
                },
              },
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
    if (treatments) {
      return treatments;
    }
    return <VCabangTreatment[]>[];
  }

  async addCabangTreatmentService({
    body,
    admin,
  }: {
    body: CreateCabangTreatmentDto;
    admin: CurrUser;
  }) {
    const check = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });
    if (check.role === 'ADMIN' && check.adminCabang.id !== body.cabangId) {
      throw unauthorized;
    }

    const treatment = await this.prisma.treatment.findFirst({
      where: {
        id: body.treatmentId,
      },
    });

    if (!treatment) {
      throw not_found;
    }
    const cabangTreatment = await this.prisma.treatmentCabang.findFirst({
      where: {
        cabangId: body.cabangId,
        treatmentId: body.treatmentId,
      },
    });

    if (cabangTreatment) {
      throw duplicate;
    }

    await this.prisma.treatmentCabang.create({
      data: {
        price: body.price,
        happyHourPrice: body.happyHourPrice,
        cabang: {
          connect: {
            id: body.cabangId,
          },
        },
        treatment: {
          connect: {
            id: body.treatmentId,
          },
        },
      },
    });
    return true;
  }

  async editCabangTreatmentService({
    body,
    admin,
  }: {
    body: CreateCabangTreatmentDto;
    admin: CurrUser;
  }) {
    const check = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });
    if (check.role === 'ADMIN' && check.adminCabang.id !== body.cabangId) {
      throw unauthorized;
    }

    const cabangTreatment = await this.prisma.treatmentCabang.findFirst({
      where: {
        cabangId: body.cabangId,
        treatmentId: body.treatmentId,
      },
    });
    if (!cabangTreatment) {
      throw not_found;
    }

    await this.prisma.treatmentCabang.update({
      where: {
        cabangId_treatmentId: {
          cabangId: body.cabangId,
          treatmentId: body.treatmentId,
        },
      },
      data: {
        price: body.price,
        happyHourPrice: body.happyHourPrice,
      },
    });
    return true;
  }

  async deleteCabangTreatmentService({
    cabangId,
    admin,
    treatmentId,
  }: {
    cabangId?: number;
    admin: CurrUser;
    treatmentId: number;
  }) {
    
    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ? cabangId : data.adminCabang.id;
    const cabangTreatment = await this.prisma.treatmentCabang.findFirst({
      where: {
        cabangId: cabangID,
        treatmentId: treatmentId,
      },
    });
    if (!cabangTreatment) {
      throw not_found;
    }
    await this.prisma.treatmentCabang.delete({
      where: {
        cabangId_treatmentId: {
          cabangId: cabangID,
          treatmentId: treatmentId,
        },
      },
    });
    return true;
  }

  async findCabangTreatmentDetail(param: {
    cabangId?: number;
    user: CurrUser;

    treatmentId: number;
  }) {
    const { user, cabangId, treatmentId } = param;
    console.log(param);

    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +user.id,
    });
    console.log(`CABANG ${JSON.stringify(data)} ${cabangId}`);
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ? cabangId : data.adminCabang.id;

    const treatments = await this.prisma.treatmentCabang.findFirst({
      where: {
        cabangId: cabangID,
        treatmentId: treatmentId,
      },

      select: {
        price: true,
        happyHourPrice: true,
        treatment: {
          select: {
            nama: true,
            id: true,
            durasi: true,
            category: {
              select: {
                nama: true,
                id: true,
                optional: true,
                happyHourPrice: true,
              },
            },
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
    if (treatments) {
      return treatments;
    }
    throw not_found;
  }
}
