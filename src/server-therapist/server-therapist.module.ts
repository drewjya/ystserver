
import { Module } from '@nestjs/common';
import { ServerTherapistService } from './server-therapist.service';
import { ServerTherapistController } from './server-therapist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerTherapistController],
  providers: [ServerTherapistService],
  imports:[PrismaModule]
})
export class ServerTherapistModule {}
