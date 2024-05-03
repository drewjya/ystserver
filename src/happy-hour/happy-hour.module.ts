import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HappyHourController } from './happy-hour.controller';
import { HappyHourService } from './happy-hour.service';

@Module({
  controllers: [HappyHourController],
  providers: [HappyHourService],
  imports: [PrismaModule],
})
export class HappyHourModule {}
