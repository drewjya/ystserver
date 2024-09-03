import { Module } from '@nestjs/common';
import { ServerCategoryService } from './server-category.service';
import { ServerCategoryController } from './server-category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ServerCategoryController],
  providers: [ServerCategoryService],
  imports:[PrismaModule]
})
export class ServerCategoryModule {}
