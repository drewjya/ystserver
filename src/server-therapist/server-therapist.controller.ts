import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { getUserFromReq } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateTherapistDto } from './server-therapist.dto';
import { ServerTherapistService } from './server-therapist.service';

@Controller('server/therapist')
export class ServerTherapistController {
  constructor(private readonly service: ServerTherapistService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findTherapistList(
    @Query('cursor') cursor: number,
    @Query('query') query: string,
    @Query('gender') gender: string,
    @Query('no') no: string,
    @Query('cabang') cabang: number,
    @Query('limit') limit: number,
  ) {
    return this.service.findTherapistList({
      cursor: cursor,
      query: query,
      gender: gender,
      no: no,
      cabang: cabang,
      limit: +limit,
    });
  }
  @UseGuards(AccessTokenGuard)
  @Post()
  createTherapist(@Req() req: Request, @Body() body: CreateTherapistDto) {
    const user = getUserFromReq(req);
    return this.service.createTherapist({
      user: user,
      body: body,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  updateTherapist(
    @Req() req: Request,
    @Body() body: CreateTherapistDto,
    @Param('id') adminId: string,
  ) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw new ApiException({
        data: 'bad_request',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.service.editTherapist({
      user: user,
      body: body,
      therapistId: id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findDetail(@Req() req: Request, @Param('id') adminId: string) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw new ApiException({
        data: 'bad_request',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.service.findTherapistDetail({
      user: user,
      therapistId: id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteAdmin(@Req() req: Request, @Param('id') adminId: string) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw new ApiException({
        data: 'bad_request',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.service.deleteTherapist({
      user: user,

      therapistId: id,
    });
  }
}
