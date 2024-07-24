import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { VDate } from 'src/utils/date/timezone.date';
import { ApiException } from 'src/utils/exception/api.exception';
import { TherapistQuery } from '../common/query/therapist.query';
import { CreateTherapistDto, UpdateTherapistDto } from './dto/therapist.dto';

@Injectable()
export class TherapistService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
    private therapistQuery: TherapistQuery,
  ) { }

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
    const today = VDate.now();
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
    const therapis = await this.prisma.therapist.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: this.therapistQuery.selectTherapistWithTreatment,
    });
    const tags = therapis.TherapistSkillTag.map((e) => {


      const treatmentsData = (e as any).tags.Treatment ?? [];
      const treatment = treatmentsData.map((tr) => {
        const val = tr;
        return {
          tag: (e as any).tags.name,
          id: val.id,
          durasi: val.durasi,
          nama: val.nama,
          category: val.category,
        }
      })

      return treatment
    });
    const treatments = tags.flat()

    const tagsData = therapis.TherapistSkillTag.map((e) => {
      const val = (e as any).tags
      return {
        name: val.name,
        id: val.id,
        treatments: val.Treatment
      }
    });
    delete therapis.TherapistSkillTag
    return {
      ...therapis,
      tags: tagsData,
      attendance:
        therapis.attendance.length > 0 ? therapis.attendance[0] : null,
      rating:
        therapis.rating.reduce((acc, curr) => {
          return acc + curr.point;
        }, 5) /
        (therapis.rating.length + 1),
      therapistTreatment: treatments,
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
        deletedAt: VDate.now(),
      },
      select: this.therapistQuery.selectTherapistBasic,
    });
  }

  async treatmentProcess(param: {
    therapistId: number;
    tagsId: number;
    userId: number;
    isAdd: boolean;
  }) {
    const { therapistId, tagsId, userId, isAdd } = param;
    await this.userQuery.findSuperAdminUnique(userId);
    if (isAdd) {
      return this.prisma.therapistSkillTag.create({
        data: {
          therapistId: therapistId,
          tagsId: tagsId
        },
      });
    }
    const find = await this.prisma.therapistSkillTag.findUnique({
      where: {
        therapistId_tagsId: {
          therapistId: therapistId,
          tagsId: tagsId,
        },
      },
    });
    if (!find) {
      throw new ApiException({
        data: 'Therapist tidak memiliki treatment ini',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.prisma.therapistSkillTag.delete({
      where: {
        therapistId_tagsId: {
          therapistId: therapistId,
          tagsId: tagsId,
        },
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
    const today = VDate.now();
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
    const today = VDate.now();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { userId, attendance, therapistId } = param;

    const user = await this.userQuery.findSuperAdminUnique(userId, [
      'SUPERADMIN',
      'ADMIN',
    ]);
    if (user.role === 'ADMIN') {
      if (!user.adminCabang) {
        throw new ApiException({
          data: 'Admin tidak memiliki cabang',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const therapist = await this.prisma.therapist.findFirst({
        where: {
          id: therapistId,
          cabangId: user.adminCabang.id,
        },
      });
      if (!therapist) {
        throw new ApiException({
          data: 'Therapist tidak ada di cabang anda',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }
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
          checkIn: VDate.now(),
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
          checkOut: VDate.now(),
        },
      });
    }
  }

  async generateTimeSlot(param: {
    cabangId: number;
    date: string;
    therapistId?: number;
  }) {
    const { cabangId, therapistId, date } = param;
    return this.therapistQuery.generateTimeSlot({
      cabangId: cabangId,
      date: new Date(date),
      therapistId: therapistId,
    });
  }

  async findingTherapistByCabangTreatmentName(param: {
    cabangId: number;
    gender: Gender;
    name: string;
  }) {
    const { cabangId, gender, name } = param;
    const therapists = await this.prisma.therapist.findMany({
      where: {
        cabangId: cabangId,
        deletedAt: null,
        gender: {
          equals: gender,
        },

        nama: {
          startsWith: name,
          mode: 'insensitive',
        },
      },
      select: this.therapistQuery.selectTherapistBasic,
    });



    return therapists.map((e) => {
      const nama = e.nama + `(${e.no})`;
      delete e.nama
      delete e.no
      return {
        nama,
        ...e
      };
    });
  }

  async findingRatingTherapist(therapistId: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId, ['SUPERADMIN', 'ADMIN']);
    const therapists = await this.prisma.therapist.findUnique({
      where: {
        id: therapistId,
        deletedAt: null,
      },
      select: {
        rating: true,
      },
    });
    return therapists;
  }
}

export enum Attendance {
  CHECKIN,
  CHECKOUT,
}
