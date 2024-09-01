import { Module } from '@nestjs/common';
import { ServerCategoryService } from './server-category.service';
import { ServerCategoryController } from './server-category.controller';

@Module({
  controllers: [ServerCategoryController],
  providers: [ServerCategoryService],
})
export class ServerCategoryModule {}
