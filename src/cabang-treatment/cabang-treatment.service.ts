import { HttpStatus, Injectable } from '@nestjs/common';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import {
  CreateCabangTreatmentDto,
  UpdateCabangTreatmentDto,
} from './dto/cabang-treatment.dto';

@Injectable()
export class CabangTreatmentService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
  ) {}

  async create(
    createCabangTreatmentDto: CreateCabangTreatmentDto,
    userId: number,
  ) {
    await this.userQuery.findSuperAdminUnique(userId);
    const { cabangId, harga, treatmentId } = createCabangTreatmentDto;
    const treatmentCabang = await this.prisma.treatmentCabang.findUnique({
      where: {
        cabangId_treatmentId: {
          cabangId,
          treatmentId,
        },
        NOT: {
          deletedAt: null,
        },
      },
    });

    const cabang = await this.prisma.cabang.findUnique({
      where: {
        id: cabangId,
        NOT: {
          deletedAt: null,
        },
      },
    });
    if (cabang) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Cabang not found',
      });
    }

    const treatment = await this.prisma.treatment.findUnique({
      where: {
        id: treatmentId,
        NOT: {
          deletedAt: null,
        },
      },
    });
    if (treatment) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'treatment not found',
      });
    }

    if (treatmentCabang) {
      return this.prisma.treatmentCabang.update({
        data: {
          deletedAt: null,
          price: harga,
          happyHourPrice: createCabangTreatmentDto.happyHourPrice,
        },
        where: {
          cabangId_treatmentId: {
            cabangId,
            treatmentId,
          },
        },
        select: {
          happyHourPrice: true,
          price: true,
          treatment: {
            select: {
              id: true,
              nama: true,
              category: {
                select: {
                  happyHourPrice: true,
                  id: true,
                  nama: true,
                },
              },
            },
          },
          cabang: {
            select: {
              nama: true,
              id: true,
            },
          },
        },
      });
    }
    return this.prisma.treatmentCabang.create({
      data: {
        cabangId: cabangId,
        treatmentId: treatmentId,
        price: harga,
        happyHourPrice: createCabangTreatmentDto.happyHourPrice,
      },
      select: {
        price: true,
        happyHourPrice: true,
        treatment: {
          select: {
            id: true,
            nama: true,
            category: {
              select: {
                happyHourPrice: true,
                id: true,
                nama: true,
              },
            },
          },
        },
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  findAll(cabangId: number) {
    return this.prisma.treatmentCabang.findMany({
      where: {
        cabang: {
          NOT: {
            deletedAt: null,
          },
          id: cabangId,
        },
        treatment: {
          NOT: {
            deletedAt: null,
          },
        },
        NOT: {
          deletedAt: null,
        },
      },
      select: {
        price: true,
        treatment: {
          select: {
            id: true,
            nama: true,
            category: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  findOne(cabangId: number, treatmentId: number) {
    return this.prisma.treatmentCabang.findUnique({
      where: {
        cabangId_treatmentId: {
          cabangId: cabangId,

          treatmentId: treatmentId,
        },
        cabang: {
          NOT: {
            deletedAt: null,
          },
        },
        treatment: {
          NOT: {
            deletedAt: null,
          },
        },
      },
      select: {
        happyHourPrice: true,
        price: true,
        treatment: {
          select: {
            id: true,
            nama: true,
            category: {
              select: {
                happyHourPrice: true,
                id: true,
                nama: true,
              },
            },
          },
        },
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  async update(param: {
    cabangId: number;
    treatmentId: number;
    userId: number;
    updateCabangTreatmentDto: UpdateCabangTreatmentDto;
  }) {
    const { userId, updateCabangTreatmentDto } = param;
    await this.userQuery.findSuperAdminUnique(userId);
    const oldTreatment = await this.prisma.treatmentCabang.findUnique({
      where: {
        cabangId_treatmentId: {
          cabangId: param.cabangId,
          treatmentId: param.treatmentId,
        },
        NOT: {
          deletedAt: null,
        },
      },
    });
    if (oldTreatment) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Treatment not found',
      });
    }
    const { harga } = updateCabangTreatmentDto;

    return this.prisma.treatmentCabang.update({
      where: {
        cabangId_treatmentId: {
          cabangId: param.cabangId,
          treatmentId: param.treatmentId,
        },
      },
      data: {
        price: harga,
        happyHourPrice: updateCabangTreatmentDto.happyHourPrice,
      },
      select: {
        price: true,
        happyHourPrice: true,
        treatment: {
          select: {
            id: true,
            nama: true,
            category: {
              select: {
                happyHourPrice: true,
                id: true,
                nama: true,
              },
            },
          },
        },
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  async remove(param: {
    cabangId: number;
    treatmentId: number;
    userId: number;
  }) {
    const { userId } = param;
    await this.userQuery.findSuperAdminUnique(userId);
    const oldTreatment = await this.prisma.treatmentCabang.findUnique({
      where: {
        cabangId_treatmentId: {
          cabangId: param.cabangId,
          treatmentId: param.treatmentId,
        },
        NOT: {
          deletedAt: null,
        },
      },
    });
    if (oldTreatment) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'Treatment not found',
      });
    }

    return this.prisma.treatmentCabang.update({
      where: {
        cabangId_treatmentId: {
          cabangId: param.cabangId,
          treatmentId: param.treatmentId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        price: true,
        happyHourPrice: true,
        treatment: {
          select: {
            id: true,
            nama: true,
            category: {
              select: {
                happyHourPrice: true,
                id: true,
                nama: true,
              },
            },
          },
        },
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }
}
