import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVersionDto } from './dto/create-version.dto';
import { VersionService } from './version.service';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) { }

  @Post()
  create(@Body() createVersionDto: CreateVersionDto) {
    return this.versionService.create(createVersionDto);
  }

  @Get()
  findAll() {
    return this.versionService.findOne();
  }

}
