import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ApiException } from 'src/utils/exception/api.exception';
import { UpdateOrderStatusDto } from './server-order.dto';
import { ServerOrderService } from './server-order.service';
import { bad_request, getUserFromReq } from './server-order.util';

@Controller('server/order')
export class ServerOrderController {
  constructor(private readonly service: ServerOrderService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findOrderList(
    @Query('therapist') therapist: string,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('gender') gender: string,
    @Query('phone') phone: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('status') status: string,
    @Query('cursor') cursors?: number,
    @Query('cabangId') cabangId?: string,
    @Query('no') no?: string,
    @Query('limit') limit?: string,
  ) {
    let cabang = +cabangId;
    let cursor = +cursors;

    return this.service.findOrderList({
      cursor,
      therapist,
      name,
      email,
      gender,
      phone,
      start,
      end,
      no,
      status,
      cabangId: cabang ? cabang : undefined,
      currLim: +limit,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('income')
  async findOrderIncome(
    @Query('date') date: string,
    @Query('cabangId') cabangId: string,
  ) {
    return this.service.findOrderIncome({
      cabangId: +cabangId,
      date: date,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOrderDetail(@Param('id') orderId: string) {
    if (!+orderId) {
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'invalid_id',
      });
    }
    return this.service.findOrderDetail(+orderId);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id/status')
  async updateStatusOrder(
    @Req() req: Request,
    @Body() body: UpdateOrderStatusDto,
    @Param('id') orderId: string,
  ) {
    const user = getUserFromReq(req);
    const id = +orderId;
    if (!id) {
      throw bad_request;
    }
    return this.service.updateStatusOrder({
      orderId: id,
      admin: user,
      body,
    });
  }
}
