import { Module } from '@nestjs/common';
import { ServerCabangService } from './server-cabang.service';
import { ServerCabangController } from './server-cabang.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerCabangController],
  providers: [ServerCabangService],
  imports:[PrismaModule]
})
export class ServerCabangModule {}
