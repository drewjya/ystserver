import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { uploadConfig } from 'src/config/upload.config';
import { ApiException } from 'src/utils/exception/api.exception';
import { checkRole } from 'src/utils/extract/request.extract';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
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
  @UseInterceptors(uploadConfig())
  @Post('buktiBayar/:orderId')
  async uploadBuktiBayar(
    @Req() req: Request,
    @Param('orderId') orderId: string,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        exceptionFactory: (err) => {
          return new ApiException({
            status: 400,
            data: {
              file: 'File is required',
            },
          });
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    const userId = checkRole(req, Role.USER);
    return this.orderService.uploadBuktiBayar({
      file: file,
      orderId: +orderId,
      userId: userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('admin/:orderId')
  async updateOrderStatus(
    @Req() req: Request,
    @Body() body: UpdateOrderStatusDto,
    @Param('orderId') orderId: string,
  ) {
    const userId = checkRole(req, [Role.ADMIN, Role.SUPERADMIN]);
    return this.orderService.updateStatusOrder({
      userId: userId,
      status: body.status,
      orderId: +orderId,
      therapistId: body.therapistId,
    });
  }
}
