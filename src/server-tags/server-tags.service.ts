import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VTags } from 'src/utils/types/server.types';

@Injectable()
export class ServerTagsService {
    constructor (private prisma: PrismaService){}
    async findTagsList(
      {
        query,
        limit,
      }:{
        query: string,
        limit?: number
      }
    ){
        const tags:VTags[] = await this.prisma.tags.findMany({
            select: {
              id: true,
              name: true,
            },
            where:{
              name:{
                startsWith:query,

              },
            },
            take: limit? limit:6,
          });
        
          return {
            tags: tags,
          };
    }
}
