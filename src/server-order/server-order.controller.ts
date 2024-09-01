import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ServerOrderService } from './server-order.service';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ApiException } from 'src/utils/exception/api.exception';

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
      status,
      cabangId:cabang,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('income')
  async findOrderIncome(
    @Query('date') date: string,
    @Query('cabangId') cabangId:string

  ) {
    return this.service.findOrderIncome({
      cabangId: +cabangId,
      date: date,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOrderDetail(@Param('id') orderId: string) {
    if(+orderId){
      throw new ApiException({
        status: HttpStatus.BAD_REQUEST,
        data: 'invalid_id'
      })
    }
    return this.service.findOrderDetail(+orderId)
  }
}
