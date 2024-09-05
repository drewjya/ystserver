import { Module } from '@nestjs/common';
import { ServerCabangtherapistService } from './server-cabangtherapist.service';
import { ServerCabangtherapistController } from './server-cabangtherapist.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerCabangtherapistController],
  providers: [ServerCabangtherapistService],
  imports:[PrismaModule]
})
export class ServerCabangtherapistModule {}
