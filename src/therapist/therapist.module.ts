import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TherapistController } from './therapist.controller';
import { TherapistService } from './therapist.service';

@Module({
  controllers: [TherapistController],
  providers: [TherapistService],
  exports: [TherapistService],
  imports: [PrismaModule, CommonModule],
})
export class TherapistModule {}
