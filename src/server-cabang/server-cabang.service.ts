import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VCabang } from 'src/utils/types/server.types';

@Injectable()
export class ServerCabangService {
    constructor(private prisma: PrismaService) { }
    async findCabangList({ limit, cursor, query }: { cursor?: number, limit: number, query?: string }) {
        let cabang: VCabang[];
        if (query) {
            cabang = await this.prisma.cabang.findMany({
                take: limit ? +limit : undefined,
                where: {
                    nama: {
                        startsWith: query,
                        mode: 'insensitive'
                    }
                },

                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    nama: true,
                    phoneNumber: true,
                    closeHour: true,
                    openHour: true,
                    picture: {
                        select: {
                            path: true,
                        },
                    },
                    alamat: true,
                },
            });
        }
        else {
            cabang = await this.prisma.cabang.findMany({
                take: limit ? +limit : undefined,
                ...(parseInt(`${cursor}`)
                    ? {
                        skip: 1, // Do not include the cursor itself in the query result.
                        cursor: {
                            id: +cursor,
                        },
                    }
                    : {}),

                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    nama: true,
                    phoneNumber: true,
                    closeHour: true,
                    openHour: true,
                    picture: {
                        select: {
                            path: true,
                        },
                    },
                    alamat: true,
                },
            });
        }

        let nextCursor: number | undefined;

        if (cabang.length < limit) {
            nextCursor = undefined;
        } else {
            nextCursor = cabang[cabang.length - 1].id;
        }

        return {
            cabang: cabang,
            nextCursor: nextCursor,
        };
    }
}
