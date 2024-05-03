import { HttpStatus, Injectable } from '@nestjs/common';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { TherapistQuery } from '../common/query/therapist.query';
import { CreateTherapistDto, UpdateTherapistDto } from './dto/therapist.dto';

@Injectable()
export class TherapistService {
  private userQuery: UserQuery;
  private therapistQuery: TherapistQuery;

  constructor(private prisma: PrismaService) {
    this.userQuery = new UserQuery(prisma);
    this.therapistQuery = new TherapistQuery(prisma);
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
      select: this.therapistQuery.selectTherapistBasic,
    });
  }

  async findAll() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const therapists = await this.prisma.therapist.findMany({
      where: {
        deletedAt: null,
      },
      select: this.therapistQuery.selectTherapistWithAttendance,
    });
    return therapists.map((therapist) => {
      return {
        ...therapist,
        attendance:
          therapist.attendance.length > 0 ? therapist.attendance[0] : null,
      };
    });
  }

  async findOne(id: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const therapis = await this.prisma.therapist.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: this.therapistQuery.selectTherapistWithTreatment,
    });
    return {
      ...therapis,
      attendance:
        therapis.attendance.length > 0 ? therapis.attendance[0] : null,
    };
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
      select: this.therapistQuery.selectTherapistBasic,
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
      select: this.therapistQuery.selectTherapistBasic,
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

  async findAllAtendanceByTherapist(therapistId: number) {
    return this.prisma.attendance.findMany({
      where: {
        therapistId: therapistId,
      },
    });
  }

  async findAllTherapistByCabangId(cabangId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const req = await this.prisma.therapist.findMany({
      where: {
        cabangId: cabangId,
        deletedAt: null,
      },
      select: this.therapistQuery.selectTherapistWithAttendance,
    });

    return req.map((therapist) => {
      return {
        ...therapist,
        attendance:
          therapist.attendance.length > 0 ? therapist.attendance[0] : null,
      };
    });
  }

  async attendanceTherapist(param: {
    userId: number;
    attendance: Attendance;
    therapistId: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { userId, attendance, therapistId } = param;

    await this.userQuery.findSuperAdminUnique(userId, ['SUPERADMIN', 'ADMIN']);
    const absensi = await this.prisma.attendance.findFirst({
      where: {
        therapistId: therapistId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (attendance === Attendance.CHECKIN) {
      if (absensi) {
        throw new ApiException({
          data: 'Anda sudah absen hari ini',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      return this.prisma.attendance.create({
        data: {
          therapist: {
            connect: {
              id: therapistId,
            },
          },
          checkIn: new Date(),
        },
      });
    } else {
      if (!absensi) {
        throw new ApiException({
          data: 'Anda belum absen hari ini',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      if (absensi.checkOut) {
        throw new ApiException({
          data: 'Anda sudah checkout hari ini',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      return this.prisma.attendance.update({
        where: {
          id: absensi.id,
        },
        data: {
          checkOut: new Date(),
        },
      });
    }
  }
}

export enum Attendance {
  CHECKIN,
  CHECKOUT,
}
