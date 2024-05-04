import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TherapistController } from './therapist.controller';
import { TherapistService } from './therapist.service';

@Module({
  controllers: [TherapistController],
  providers: [TherapistService],
  exports: [TherapistService],
  imports: [PrismaModule],
})
export class TherapistModule {}
