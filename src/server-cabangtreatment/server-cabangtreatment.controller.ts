import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { getUserFromReq } from 'src/server-order/server-order.util';
import { ServerCabangtreatmentService } from './server-cabangtreatment.service';

@Controller('server/cabangtreatment')
export class ServerCabangtreatmentController {
  constructor(private readonly service: ServerCabangtreatmentService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findList(
    @Req() req: Request,
    @Query('cursor') cursor: number,
    @Query('query') query: string,
    @Query('category') category: number,
    @Query('tag') tag: number,
    @Query('limit') limit: number,
    @Query('cabangId') cabangId: number,
  ) {
    const user = getUserFromReq(req);
    console.log(user, "USER");
    
    return this.service.findCabangTreatmentList({
      limit: +limit ? +limit : 10,
      query: query,
      user: user,
      cabangId: +cabangId,
      category: +category,
      cursor: +cursor,
      tag: +tag,
    });
  }
}
