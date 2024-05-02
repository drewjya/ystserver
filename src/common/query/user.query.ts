import { HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';

export class UserQuery {
  private prisma: PrismaService;
  constructor(_prisma: PrismaService) {
    this.prisma = _prisma;
  }

  async findSuperAdminUnique(userId: number) {
    const superadmin = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (superadmin.role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }
    return superadmin;
  }
}
