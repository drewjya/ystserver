import { Module } from '@nestjs/common';
import { ServerTherapistService } from './server-therapist.service';
import { ServerTherapistController } from './server-therapist.controller';

@Module({
  controllers: [ServerTherapistController],
  providers: [ServerTherapistService],
})
export class ServerTherapistModule {}
