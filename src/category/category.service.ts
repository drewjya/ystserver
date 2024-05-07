import { HttpStatus, Injectable } from '@nestjs/common';
import { UserQuery } from 'src/common/query/user.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private userQuery: UserQuery,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);

    const category = await this.prisma.category.findUnique({
      where: {
        nama: createCategoryDto.name,
        NOT: {
          deletedAt: null,
        },
      },
    });

    if (category) {
      return this.prisma.category.update({
        data: {
          deletedAt: null,
          happyHourPrice: createCategoryDto.happyHourPrice,
          optional: createCategoryDto.optional,
        },
        where: {
          id: category.id,
        },
      });
    }

    return this.prisma.category.create({
      data: {
        nama: createCategoryDto.name,
        optional: createCategoryDto.optional,
        happyHourPrice: createCategoryDto.happyHourPrice,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.userQuery.findSuperAdminUnique(userId);
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!category) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'category_not_found',
      });
    }
    return this.prisma.category.update({
      data: {
        nama: updateCategoryDto.name,
        happyHourPrice: updateCategoryDto.happyHourPrice,
        optional: updateCategoryDto.optional,
      },
      where: {
        id: id,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.userQuery.findSuperAdminUnique(userId);
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
    });
    if (!category) {
      throw new ApiException({
        status: HttpStatus.NOT_FOUND,
        data: 'category_not_found',
      });
    }
    return this.prisma.category.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: id,
      },
    });
  }
}
