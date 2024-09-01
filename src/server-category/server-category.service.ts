import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VCategory } from 'src/utils/types/server.types';

@Injectable()
export class ServerCategoryService {
    constructor(private prisma: PrismaService) { }
    async findCategoryList() {
        const category: VCategory[] = await this.prisma.category.findMany({
            select: {
                id: true,
                nama: true,
            },
        });

        return {
            category: category,
        };
    }
}
