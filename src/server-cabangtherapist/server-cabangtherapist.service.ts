import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  bad_request,
  checkUserAdmin,
  not_found,
  unauthorized,
} from 'src/server-order/server-order.util';
import { getUtcDateToday } from 'src/server-therapist/server-therapist.service';
import { VDate } from 'src/utils/date/timezone.date';
import { ApiException } from 'src/utils/exception/api.exception';
import { CurrUser } from 'src/utils/types/server.types';

@Injectable()
export class ServerCabangtherapistService {
  constructor(private prisma: PrismaService) {}

  async addTherapistCabang({
    cabangId,
    admin,
    therapistId,
  }: {
    cabangId?: number;
    admin: CurrUser;
    therapistId: number;
  }) {
    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ?? data.adminCabang.id;

    const therapist = await this.prisma.therapist.findFirst({
      where: {
        id: therapistId,
      },
      select: {
        cabang: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!therapist) {
      throw not_found;
    }
    if (therapist.cabang) {
      throw new ApiException({
        data: 'therapist_sudah_di_cabang_lain',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    await this.prisma.therapist.update({
      where: {
        id: therapistId,
      },
      data: {
        cabang: {
          connect: {
            id: cabangID,
          },
        },
      },
    });
    return true;
  }

  async removeTherapistCabang({
    cabangId,
    admin,
    therapistId,
  }: {
    cabangId?: number;
    admin: CurrUser;
    therapistId: number;
  }) {
    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +admin.id,
    });
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ?? data.adminCabang.id;

    const therapist = await this.prisma.therapist.findFirst({
      where: {
        id: therapistId,
        cabang: {
          id: cabangID,
        },
      },
      select: {
        cabang: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!therapist) {
      throw not_found;
    }

    await this.prisma.therapist.update({
      where: {
        id: therapistId,
      },
      data: {
        cabang: {
          disconnect: {
            id: cabangID,
          },
        },
      },
    });
    return true;
  }

  
}
