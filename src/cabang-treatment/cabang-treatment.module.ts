import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CabangTreatmentController } from './cabang-treatment.controller';
import { CabangTreatmentService } from './cabang-treatment.service';

@Module({
  controllers: [CabangTreatmentController],
  providers: [CabangTreatmentService],
  imports: [PrismaModule],
})
export class CabangTreatmentModule {}
