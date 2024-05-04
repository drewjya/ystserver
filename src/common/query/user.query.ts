import { HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';

export class UserQuery {
  private prisma: PrismaService;
  constructor(_prisma: PrismaService) {
    this.prisma = _prisma;
  }

  async findSuperAdminUnique(userId: number, role?: Role[]) {
    const superadmin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        adminCabang: true,
      },
    });
    if (!superadmin) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'User not found',
      });
    }
    console.log(role, superadmin.role);

    if (role) {
      if (!role.includes(superadmin.role)) {
        throw new ApiException({
          status: HttpStatus.UNAUTHORIZED,
          data: 'unauthorized',
        });
      }
    } else if (superadmin.role !== Role.SUPERADMIN) {
      throw new ApiException({
        status: HttpStatus.UNAUTHORIZED,
        data: 'unauthorized',
      });
    }
    return superadmin;
  }
}
