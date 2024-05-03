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
import { CabangTreatmentService } from './cabang-treatment.service';
import {
  CreateCabangTreatmentDto,
  UpdateCabangTreatmentDto,
} from './dto/cabang-treatment.dto';

@Controller('cabang-treatment')
export class CabangTreatmentController {
  constructor(
    private readonly cabangTreatmentService: CabangTreatmentService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Req() req: Request,
    @Body() createCabangTreatmentDto: CreateCabangTreatmentDto,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.cabangTreatmentService.create(createCabangTreatmentDto, userId);
  }

  @Get(':cabangId/treatment')
  findAll(@Param('cabangId') cabangId: string) {
    return this.cabangTreatmentService.findAll(+cabangId);
  }

  @Get(':cabangId/treatment/:treatmentId')
  findOne(
    @Param('cabangId') cabangId: string,
    @Param('treatmentId') treatmentId: string,
  ) {
    return this.cabangTreatmentService.findOne(+cabangId, +treatmentId);
  }
  @UseGuards(AccessTokenGuard)
  @Put(':cabangId/treatment/:treatmentId')
  update(
    @Req() req: Request,
    @Param('cabangId') cabangId: string,
    @Param('treatmentId') treatmentId: string,
    @Body() updateCabangTreatmentDto: UpdateCabangTreatmentDto,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.cabangTreatmentService.update({
      cabangId: +cabangId,
      treatmentId: +treatmentId,
      updateCabangTreatmentDto,
      userId,
    });
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':cabangId/treatment/:treatmentId')
  remove(
    @Req() req: Request,
    @Param('cabangId') cabangId: string,
    @Param('treatmentId') treatmentId: string,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.cabangTreatmentService.remove({
      cabangId: +cabangId,
      treatmentId: +treatmentId,
      userId,
    });
  }
}
