import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ServerTagsService } from './server-tags.service';
import { AccessTokenGuard } from 'src/common/access-token.guard';

@Controller('server/tags')
export class ServerTagsController {
  constructor(private readonly service: ServerTagsService) { }

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findTagsList(@Query('query') query: string, @Query('limit') limit:string) {
    return this.service.findTagsList({
      query: query,
      limit: +limit
    });
  }
}
