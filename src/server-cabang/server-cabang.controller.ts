import { Controller, Get, Query } from '@nestjs/common';
import { ServerCabangService } from './server-cabang.service';

@Controller('server/cabang')
export class ServerCabangController {
  constructor(private readonly service: ServerCabangService) {

  }
   @Get('')
  async findCabangList(@Query('cursor') cursor: string, @Query('limit') limit: string) {
    return this.service.findCabangList();
  }
}
