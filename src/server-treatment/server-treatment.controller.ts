import { Controller, Get, Query } from '@nestjs/common';
import { ServerTreatmentService } from './server-treatment.service';

@Controller('server-treatment')
export class ServerTreatmentController {
  constructor(private readonly service: ServerTreatmentService) {

  }
  @Get()
  async findTreatmentList(
    @Query('cursor') cursor: number,
    @Query('query') query: string,
    @Query('category') category: number,
    @Query('tag') tag: number,
  ) {
    return this.service.findTreatmentList()
  }
}
