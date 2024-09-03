import { HttpStatus, Injectable } from '@nestjs/common';
import { hashPassword } from 'src/common/encrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUserAdmin } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { VAdmin } from 'src/utils/types/server.types';
import { CreateNewAdmin, DeleteAdmin, EditAdmin } from './server-admin.entity';

@Injectable()
export class ServerAdminService {
  constructor(private prisma: PrismaService) {}

  async findAdminList() {
    const users: VAdmin[] = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        adminCabang: {
          select: {
            nama: true,
            picture: {
              select: {
                path: true,
              },
            },
            id: true,
          },
        },
        email: true,
        role: true,
      },
    });
    return {
      admins: users,
    };
  }

  async createNewAdmin({
    user,
    body,
  }: {
    user: {
      role: string;
      id: string;
    };
    body: CreateNewAdmin;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });
    const cabang = await this.prisma.cabang.findFirst({
      where: {
        id: body.cabangId,
      },
    });
    if (!cabang) {
      throw new ApiException({
        data: 'not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    const hashedPassword = await hashPassword(body.password);
    await this.prisma.user.create({
      data: {
        email: body.email,
        role: 'ADMIN',
        name: `Admin ${cabang.nama}`,
        password: hashedPassword,
        phoneNumber: cabang.phoneNumber,
        isConfirmed: true,
        adminCabang: {
          connect: {
            id: cabang.id,
          },
        },
      },
    });

    return true;
  }

  async editAdmin({
    user,
    body,
  }: {
    user: {
      role: string;
      id: string;
    };
    body: EditAdmin;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const hashedPassword = await hashPassword(body.password);
    const updatedUser = await this.prisma.user.update({
      where: {
        id: body.adminId,
        adminCabang: {
          id: body.cabangId,
        },
      },
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });
    if (!updatedUser) {
      throw new ApiException({
        data: 'not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return true;
  }

  async deleteAdmin({
    user,
    body,
    adminId,
  }: {
    user: {
      role: string;
      id: string;
    };
    body: DeleteAdmin;
    adminId: number;
  }) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: +user.id,
    });

    const deleteUser = await this.prisma.user.delete({
      where: {
        id: adminId,
        adminCabang: {
          id: body.cabangId,
        },
      },
    });
    if (!deleteUser) {
      throw new ApiException({
        data: 'not_found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return true;
  }
}
