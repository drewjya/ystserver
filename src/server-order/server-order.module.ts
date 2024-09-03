import { Module } from '@nestjs/common';
import { ServerOrderService } from './server-order.service';
import { ServerOrderController } from './server-order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerOrderController],
  providers: [ServerOrderService],
  imports:[PrismaModule]
})
export class ServerOrderModule {}
