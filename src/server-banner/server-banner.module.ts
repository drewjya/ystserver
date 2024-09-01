import { Module } from '@nestjs/common';
import { ServerBannerService } from './server-banner.service';
import { ServerBannerController } from './server-banner.controller';

@Module({
  controllers: [ServerBannerController],
  providers: [ServerBannerService],
})
export class ServerBannerModule {}
