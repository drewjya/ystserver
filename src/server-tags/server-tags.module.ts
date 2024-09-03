import { Module } from '@nestjs/common';
import { ServerTagsService } from './server-tags.service';
import { ServerTagsController } from './server-tags.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerTagsController],
  providers: [ServerTagsService],
  imports:[PrismaModule]
})
export class ServerTagsModule {}
