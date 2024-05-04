import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CabangController } from './cabang.controller';
import { CabangService } from './cabang.service';

@Module({
  controllers: [CabangController],
  providers: [CabangService],
  imports: [PrismaModule, CommonModule],
})
export class CabangModule {}
