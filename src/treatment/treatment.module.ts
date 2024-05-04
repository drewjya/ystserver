import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';

@Module({
  controllers: [TreatmentController],
  providers: [TreatmentService],
  imports: [PrismaModule, CommonModule],
})
export class TreatmentModule {}
