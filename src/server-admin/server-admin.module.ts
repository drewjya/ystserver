import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ServerAdminController } from './server-admin.controller';
import { ServerAdminService } from './server-admin.service';

@Module({
  controllers: [ServerAdminController],
  providers: [ServerAdminService],
  imports: [PrismaModule]
})
export class ServerAdminModule { }
