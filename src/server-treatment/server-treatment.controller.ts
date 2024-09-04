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
import { bad_request, getUserFromReq } from 'src/server-order/server-order.util';
import { CreateTreatmentDto } from './server-treatment.dto';
import { ServerTreatmentService } from './server-treatment.service';

@Controller('server/treatment')
export class ServerTreatmentController {
  constructor(private readonly service: ServerTreatmentService) {}
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
      limit: +limit ? +limit : 10,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createTherapist(@Req() req: Request, @Body() body: CreateTreatmentDto) {
    const user = getUserFromReq(req);
    return this.service.createTreatment({
      user: user,
      body: body,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  updateTherapist(
    @Req() req: Request,
    @Body() body: CreateTreatmentDto,
    @Param('id') adminId: string,
  ) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw bad_request;
    }
    return this.service.editTreatment({
      user: user,
      body: body,
      treatmentId: id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findDetail(@Req() req: Request, @Param('id') adminId: string) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw bad_request;
    }
    return this.service.findTreatmentDetail(id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteAdmin(@Req() req: Request, @Param('id') adminId: string) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw bad_request;
    }
    return this.service.deleteTreatment({
      user: user,

      treatmentId: id,
    });
  }
}
