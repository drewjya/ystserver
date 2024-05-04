import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HappyHourController } from './happy-hour.controller';
import { HappyHourService } from './happy-hour.service';

@Module({
  controllers: [HappyHourController],
  providers: [HappyHourService],
  imports: [PrismaModule, CommonModule],
})
export class HappyHourModule {}
