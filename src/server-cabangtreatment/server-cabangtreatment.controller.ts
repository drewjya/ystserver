import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import {
  bad_request,
  getUserFromReq,
} from 'src/server-order/server-order.util';
import { CreateCabangTreatmentDto } from 'src/server-treatment/server-treatment.dto';
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
    console.log(user, 'USER');

    return this.service.findCabangTreatmentList({
      limit: +limit ? +limit : 10,
      query: query,
      user: user,
      cabangId: +cabangId ? +cabangId : undefined,
      category: +category,
      cursor: +cursor,
      tag: +tag,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findListDetail(
    @Req() req: Request,
    @Param('id') id: string,
    @Query('cabang') cabangId: string,
  ) {
    const user = getUserFromReq(req);
    if (!+id) {
      throw bad_request;
    }

    return this.service.findCabangTreatmentDetail({
      treatmentId: +id,
      user,
      cabangId: +cabangId ? +cabangId : undefined,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  addNewTreatment(@Body() body: CreateCabangTreatmentDto, @Req() req: Request) {
    const admin = getUserFromReq(req);
    return this.service.addCabangTreatmentService({
      body: body,
      admin,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  editNewTreatment(
    @Body() body: CreateCabangTreatmentDto,
    @Req() req: Request,
  ) {
    const admin = getUserFromReq(req);
    return this.service.editCabangTreatmentService({
      body: body,
      admin,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteTreatment(
    @Param('id') id: string,
    @Req() req: Request,
    @Query('cabang') cabang?: string,
  ) {
    const admin = getUserFromReq(req);
    const treatmetId = +id;
    if (!treatmetId) {
      throw bad_request;
    }
    return this.service.deleteCabangTreatmentService({
      treatmentId: treatmetId,
      cabangId: +cabang ? +cabang : undefined,
      admin,
    });
  }
}
