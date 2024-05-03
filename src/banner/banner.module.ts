import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  imports: [PrismaModule],
})
export class BannerModule {}
