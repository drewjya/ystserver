import { Module } from '@nestjs/common';
import { ServerOrderService } from './server-order.service';
import { ServerOrderController } from './server-order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ServerOrderController],
  providers: [ServerOrderService],
  imports:[PrismaModule, CommonModule]
})
export class ServerOrderModule {}
