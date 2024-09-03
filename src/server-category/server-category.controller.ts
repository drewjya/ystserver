import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ServerCategoryService } from './server-category.service';

@Controller('server/category')
export class ServerCategoryController {
  constructor(private readonly service: ServerCategoryService) { }

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findCategoryList(@Query('query') query: string, @Query('limit') limit: string) {
    return this.service.findCategoryList({
      query: query,
      limit: +limit
    });
  }

}
