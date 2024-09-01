import { Controller, Get } from '@nestjs/common';
import { ServerCategoryService } from './server-category.service';

@Controller('server-category')
export class ServerCategoryController {
  constructor(private readonly service: ServerCategoryService) {}
  @Get('category')
  async findCategoryList() {
    return this.service.findCategoryList();
  }

}
