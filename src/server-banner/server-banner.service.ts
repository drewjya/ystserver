import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VBanner } from 'src/utils/types/server.types';

@Injectable()
export class ServerBannerService {
    constructor(private prisma: PrismaService) { }
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
        })
        const banner: VBanner[] = data.map((e) => {
            return {
                id: e.id,
                path: e.picture.path,
            }
        })
        return {
            banner: banner
        }

    }
}
