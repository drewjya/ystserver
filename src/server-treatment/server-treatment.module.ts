import { Module } from '@nestjs/common';
import { ServerTreatmentService } from './server-treatment.service';
import { ServerTreatmentController } from './server-treatment.controller';

@Module({
  controllers: [ServerTreatmentController],
  providers: [ServerTreatmentService],
})
export class ServerTreatmentModule {}
