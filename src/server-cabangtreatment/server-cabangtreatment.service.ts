import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { checkUserAdmin, not_found } from 'src/server-order/server-order.util';
import { CurrUser, VCabangTreatment } from 'src/utils/types/server.types';

@Injectable()
export class ServerCabangtreatmentService {
  constructor(private prisma: PrismaService) {}

  async findCabangTreatmentList(param: {
    cabangId?: number;
    user: CurrUser;
    cursor?: number;
    query: string;
    category?: number;
    tag?: number;
    limit: number;
  }) {
    const { limit, query, user, cabangId, category, cursor, tag } = param;
    console.log(param);

    const data = await checkUserAdmin({
      prisma: this.prisma,
      role: ['ADMIN', 'SUPERADMIN'],
      userId: +user.id,
    });
    console.log(`CABANG ${JSON.stringify(data)} ${cabangId}`);
    if (!cabangId && !data?.adminCabang) {
      throw not_found;
    }
    const cabangID = cabangId ?? data.adminCabang.id;

    const treatments: VCabangTreatment[] =
      await this.prisma.treatmentCabang.findMany({
        take: limit,
        ...(parseInt(`${cursor}`)
          ? {
              skip: 1, // Do not include the cursor itself in the query result.
              cursor: {
                cabangId_treatmentId: {
                  cabangId: cabangID,
                  treatmentId: +cursor,
                },
              },
            }
          : {}),
        where: {
          cabangId: cabangID,
          treatment:
            query || category || tag
              ? {
                  categoryId: category ? category : undefined,
                  tagsId: tag ? tag : undefined,
                  nama: query
                    ? {
                        startsWith: query,
                        mode: 'insensitive',
                      }
                    : undefined,
                }
              : undefined,
        },

        select: {
          price: true,
          happyHourPrice: true,
          treatment: {
            select: {
              nama: true,
              id: true,
              durasi: true,
              category: {
                select: {
                  nama: true,
                  id: true,
                  optional: true,
                  happyHourPrice: true,
                },
              },
              tags: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    if (treatments) {
      return treatments;
    }
    return <VCabangTreatment[]>[];
  }
}
