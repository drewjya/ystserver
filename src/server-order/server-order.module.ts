import { Module } from '@nestjs/common';
import { ServerOrderService } from './server-order.service';
import { ServerOrderController } from './server-order.controller';

@Module({
  controllers: [ServerOrderController],
  providers: [ServerOrderService],
})
export class ServerOrderModule {}
