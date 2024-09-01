import { Module } from '@nestjs/common';
import { ServerCabangService } from './server-cabang.service';
import { ServerCabangController } from './server-cabang.controller';

@Module({
  controllers: [ServerCabangController],
  providers: [ServerCabangService],
})
export class ServerCabangModule {}
