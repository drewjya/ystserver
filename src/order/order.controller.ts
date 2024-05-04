import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async getHistoryOrderUser(
    @Req() req: Request,
    @Query('status') status: OrderStatus,
  ) {
    const userId = checkRole(req, Role.USER);
    return this.orderService.getHistoryOrderUser(userId, status);
  }

  @UseGuards(AccessTokenGuard)
  @Get('admin')
  async getHistoryOrderAdmin(
    @Req() req: Request,
    @Query('status') status: OrderStatus,
  ) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
    return this.orderService.getHistoryOrderAdmin(userId, status);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async createOrder(@Req() req: Request, @Body() body: CreateOrderDto) {
    const userId = checkRole(req, Role.USER);
    console.log(userId);

    return this.orderService.createOrder(userId, body);
  }

  @UseGuards(AccessTokenGuard)
  @Post('buktiBayar/:orderId')
  async uploadBuktiBayar(@Req() req: Request) {
    const userId = checkRole(req, Role.USER);
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId/confirm')
  async confirmOrder(@Req() req: Request) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId/cancel')
  async cancelOrder(@Req() req: Request) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId/complete')
  async completeOrder(@Req() req: Request) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId/reschedule')
  async failedOrder(@Req() req: Request) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId/ongoing')
  async ongoingOrder(@Req() req: Request) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
  }
}
