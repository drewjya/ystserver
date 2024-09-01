import { Controller, Get } from '@nestjs/common';
import { ServerTagsService } from './server-tags.service';

@Controller('server/tags')
export class ServerTagsController {
  constructor(private readonly service: ServerTagsService) { }

  @Get()
  async findTagsList() {
    return this.service.findTagsList();
  }
}
