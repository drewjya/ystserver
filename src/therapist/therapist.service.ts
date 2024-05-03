import { Injectable } from '@nestjs/common';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTherapistDto, UpdateTherapistDto } from './dto/therapist.dto';

@Injectable()
export class TherapistService {
  private userQuery: UserQuery;

  constructor(private prisma: PrismaService) {
    this.userQuery = new UserQuery(prisma);
  }

  async create(param: {
    createTherapistDto: CreateTherapistDto;
    userId: number;
  }) {
    const { createTherapistDto, userId } = param;
    await this.userQuery.findSuperAdminUnique(userId);
    return this.prisma.therapist.create({
      data: {
        nama: createTherapistDto.name,
        gender: createTherapistDto.gender,
        cabang: {
          connect: {
            id: createTherapistDto.cabangId,
          },
        },
      },
      select: {
        id: true,
        nama: true,
        gender: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.therapist.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        nama: true,
        gender: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.therapist.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: {
        id: true,
        nama: true,
        gender: true,
        therapistTreatment: {
          select: {
            treatment: {
              select: {
                nama: true,
                id: true,
                category: {
                  select: {
                    nama: true,
                    id: true,
                  },
                },
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

  async update(
    id: number,
    updateTherapistDto: UpdateTherapistDto,
    userId: number,
  ) {
    await this.userQuery.findSuperAdminUnique(userId);
    return this.prisma.therapist.update({
      where: {
        id: id,
      },
      data: {
        nama: updateTherapistDto.name,
        cabang: {
          connect: {
            id: updateTherapistDto.cabangId,
          },
        },
      },
      select: {
        id: true,
        nama: true,
        gender: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
    return this.prisma.therapist.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        nama: true,
        gender: true,
        cabang: {
          select: {
            nama: true,
            id: true,
          },
        },
      },
    });
  }

  async addTreatment(param: {
    therapistId: number;
    treatmentId: number;
    userId: number;
  }) {
    const { therapistId, treatmentId, userId } = param;
    await this.userQuery.findSuperAdminUnique(userId);
    return this.prisma.therapistTreatment.create({
      data: {
        therapistId: therapistId,
        treatmentId: treatmentId,
      },
    });
  }
}
