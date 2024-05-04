import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CabangTreatmentController } from './cabang-treatment.controller';
import { CabangTreatmentService } from './cabang-treatment.service';

@Module({
  controllers: [CabangTreatmentController],
  providers: [CabangTreatmentService],
  imports: [PrismaModule, CommonModule],
})
export class CabangTreatmentModule {}
