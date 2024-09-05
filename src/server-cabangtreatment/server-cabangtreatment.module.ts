import { Module } from '@nestjs/common';
import { ServerCabangtreatmentService } from './server-cabangtreatment.service';
import { ServerCabangtreatmentController } from './server-cabangtreatment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerCabangtreatmentController],
  providers: [ServerCabangtreatmentService],
  imports:[PrismaModule]
})
export class ServerCabangtreatmentModule {}
