import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateHappyHourDto, UpdateHappyHourDto } from './dto/happy-hour.json';

import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { HappyHourService } from './happy-hour.service';

@Controller('happy-hour')
export class HappyHourController {
  constructor(private readonly happyHourService: HappyHourService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':cabangId')
  create(
    @Req() request: Request,
    @Param('cabangId') cabangId: string,
    @Body() createHappyHourDto: CreateHappyHourDto,
  ) {
    const userId = checkRole(request, 'ADMIN');
    return this.happyHourService.create({
      cabangId: +cabangId,
      userId,
      createHappyHourDto,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.happyHourService.findOne(+id);
  }

  @Post(':cabangId')
  update(
    @Req() request: Request,
    @Param('cabangId') cabangId: string,
    @Body() updateHappyHourDto: UpdateHappyHourDto,
  ) {}

  @Post(':cabangId/disable')
  disable(@Req() request: Request, @Param('cabangId') cabangId: string) {}
}
