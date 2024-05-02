import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CabangController } from './cabang.controller';
import { CabangService } from './cabang.service';

@Module({
  controllers: [CabangController],
  providers: [CabangService],
  imports: [PrismaModule],
})
export class CabangModule {}
