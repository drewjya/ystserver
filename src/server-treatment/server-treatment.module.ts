import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServerTreatmentController } from './server-treatment.controller';
import { ServerTreatmentService } from './server-treatment.service';

@Module({
  controllers: [ServerTreatmentController],
  providers: [ServerTreatmentService],
  imports: [PrismaModule]
})
export class ServerTreatmentModule { }
