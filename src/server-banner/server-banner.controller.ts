import { Controller, Get } from '@nestjs/common';
import { ServerBannerService } from './server-banner.service';

@Controller('server/banner')
export class ServerBannerController {
  constructor(private readonly service: ServerBannerService) {}

  @Get()
  findAll() {
    return this.service.findAllBanner();
  }
}
