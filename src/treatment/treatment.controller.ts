import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { CreateTreatmentDto, UpdateTreatmentDto } from './dto/treatment.dto';
import { TreatmentService } from './treatment.service';

@Controller('treatment')
export class TreatmentController {
  constructor(private readonly treatmentService: TreatmentService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createTreatmentDto: CreateTreatmentDto, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.treatmentService.create({
      createTreatmentDto: createTreatmentDto,
      userId: userId,
    });
  }

  @Get()
  findAll() {
    return this.treatmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.treatmentService.update({
      id: +id,
      updateTreatmentDto,
      userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.treatmentService.remove(+id, userId);
  }
}
