import { Controller, Get, Query } from '@nestjs/common';
import { ServerTherapistService } from './server-therapist.service';

@Controller('server/therapist')
export class ServerTherapistController {
  constructor(private readonly service: ServerTherapistService) {}


  @Get()
  async findTherapistList(
    @Query('cursor') cursor: number,
    @Query('query') query: string,
    @Query('gender') gender: string,
    @Query('no') no: string,
    @Query('cabang') cabang: number,
  ) {
    return this.service.findTherapistList()
  }

}
