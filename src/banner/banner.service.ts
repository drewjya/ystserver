import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { removeStoragePath } from '../config/upload.config';

@Injectable()
export class BannerService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
  ) {}

  async create(file: Express.Multer.File, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
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

  findAll() {
    return this.prisma.banner.findMany({
      select: {
        picture: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
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
    unlink(banner.picture.path, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    return bandel;
  }
}
