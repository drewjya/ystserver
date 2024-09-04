import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { addStoragePath, removeStoragePath } from 'src/config/upload.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUserAdmin } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { VBanner } from 'src/utils/types/server.types';

@Injectable()
export class ServerBannerService {
  constructor(private prisma: PrismaService) {}
  async findAllBanner() {
    const data = await this.prisma.banner.findMany({
      select: {
        id: true,
        picture: {
          select: {
            path: true,
          },
        },
      },
    });
    const banner: VBanner[] = data.map((e) => {
      return {
        id: e.id,
        path: e.picture.path,
      };
    });
    return {
      banner: banner,
    };
  }

  async create(file: Express.Multer.File, userId: number) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: userId,
    });
    return this.prisma.banner.create({
      data: {
        picture: {
          create: {
            path: removeStoragePath(file.path),
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    await checkUserAdmin({
      prisma: this.prisma,
      role: 'SUPERADMIN',
      userId: userId,
    });

    const banner = await this.prisma.banner.findUnique({
      where: {
        id,
      },
      include: {
        picture: true,
      },
    });

    if (!banner) {
      throw new ApiException({ data: 'Banner not found', status: 404 });
    }

    console.log(banner);

    const bandel = await this.prisma.banner.delete({
      where: {
        id,
      },
    });
    await this.prisma.picture.delete({
      where: {
        id: banner.pictureId,
      },
    });
    unlink( addStoragePath(banner.picture.path), (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    return bandel;
  }
}
