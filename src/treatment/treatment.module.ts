import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';

@Module({
  controllers: [TreatmentController],
  providers: [TreatmentService],
  imports: [PrismaModule],
})
export class TreatmentModule {}
