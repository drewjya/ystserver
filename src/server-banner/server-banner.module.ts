import { Module } from '@nestjs/common';
import { ServerBannerService } from './server-banner.service';
import { ServerBannerController } from './server-banner.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerBannerController],
  providers: [ServerBannerService,],
  imports:[PrismaModule]
})
export class ServerBannerModule {}
