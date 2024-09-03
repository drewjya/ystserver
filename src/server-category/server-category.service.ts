import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VCategory } from 'src/utils/types/server.types';

@Injectable()
export class ServerCategoryService {
  constructor(private prisma: PrismaService) {}
  async findCategoryList({ query, limit }: { query: string; limit?: number }) {
    const category: VCategory[] = await this.prisma.category.findMany({
      select: {
        id: true,
        nama: true,
      },
      where: {
        nama: {
          startsWith: query,
          mode: 'insensitive',
        },
      },
      take: limit ? limit : 6,
    });

    return {
      category: category,
    };
  }
}
