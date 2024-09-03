import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ServerTreatmentService } from './server-treatment.service';
import { AccessTokenGuard } from 'src/common/access-token.guard';

@Controller('server/treatment')
export class ServerTreatmentController {
  constructor(private readonly service: ServerTreatmentService) {

  }
  @UseGuards(AccessTokenGuard)
  @Get()
  async findTreatmentList(
    @Query('cursor') cursor: number,
    @Query('query') query: string,
    @Query('category') category: number,
    @Query('tag') tag: number,
    @Query('limit') limit: number,
  ) {
    console.log(+limit ?? 10);

    return this.service.findTreatmentList({
      tag: +tag,
      category: +category,
      cursor: +cursor,
      query: query,
      limit: +limit ? +limit: 10,
    })
  }
}
