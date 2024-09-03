import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VTreatment } from 'src/utils/types/server.types';

@Injectable()
export class ServerTreatmentService {
    constructor(private prisma: PrismaService) { }
    async findTreatmentList({
        query,
        cursor,
        category,
        tag,
        limit,
    }: { cursor?: number; query: string; category?: number; tag?: number, limit: number }) {

        let items: VTreatment[];
        if (query || category || tag) {
            items = await this.prisma.treatment.findMany({
              take: limit,
              ...(parseInt(`${cursor}`)
                ? {
                    skip: 1, // Do not include the cursor itself in the query result.
                    cursor: {
                      id: +cursor,
                    },
                  }
                : {}),
              where: {
                nama: query
                  ? {
                      startsWith: query,
                    }
                  : undefined,
                tagsId: tag ? +tag : undefined,
                categoryId: category ? +category : undefined,
              },
              select: {
                id: true,
                nama: true,
                category: {
                  select: {
                    nama: true,
                    id: true,
                  },
                },
                durasi: true,
                tags: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            });
            return {
              treatment: items,
              nextCursor: null,
            };
          }
        
          items = await this.prisma.treatment.findMany({
            take: limit,
            ...(parseInt(`${cursor}`)
              ? {
                  skip: 1, // Do not include the cursor itself in the query result.
                  cursor: {
                    id: +cursor,
                  },
                }
              : {}),
            select: {
              id: true,
              nama: true,
              category: {
                select: {
                  nama: true,
                  id: true,
                },
              },
              durasi: true,
              tags: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          });
          let nextCursor: number | undefined;
        
          if (items.length < limit) {
            nextCursor = undefined;
          } else {
            nextCursor = items[items.length - 1].id;
          }
        
          return {
            treatment: items,
            nextCursor: nextCursor ?? null,
          };

    }
}
