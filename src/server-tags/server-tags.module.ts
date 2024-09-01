import { Module } from '@nestjs/common';
import { ServerTagsService } from './server-tags.service';
import { ServerTagsController } from './server-tags.controller';

@Module({
  controllers: [ServerTagsController],
  providers: [ServerTagsService],
})
export class ServerTagsModule {}
