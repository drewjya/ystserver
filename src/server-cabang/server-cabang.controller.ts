import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ServerCabangService } from './server-cabang.service';

@Controller('server/cabang')
export class ServerCabangController {
  constructor(private readonly service: ServerCabangService) {

  }

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findCabangList(@Query('cursor') cursor: string, @Query('limit') limit: string, @Query('query') query: string) {


    return this.service.findCabangList(
      {
        query: query,
        cursor: +cursor,
        limit: +limit ?? 6
      }
    );
  }
}
