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
import {
  AddTreatmentDto,
  CreateTherapistDto,
  UpdateTherapistDto,
} from './dto/therapist.dto';

import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { Attendance, TherapistService } from './therapist.service';

@Controller('therapist')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Req() req: Request, @Body() createTherapistDto: CreateTherapistDto) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.create({ createTherapistDto, userId });
  }

  @Get()
  findAll() {
    return this.therapistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.therapistService.findOne(+id);
  }
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTherapistDto: UpdateTherapistDto,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.update(+id, updateTherapistDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.remove(+id, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/treatment')
  addTreatment(
    @Param('id') id: string,
    @Body() body: AddTreatmentDto,
    @Req() req: Request,
  ) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.addTreatment({
      therapistId: +id,
      treatmentId: body.treatmentId,
      userId: userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/attendance')
  async getAttendance(@Param('id') id: string) {
    return this.therapistService.findAllAtendanceByTherapist(+id);
  }

  @Get('cabang/:cabangId')
  findByCabang(@Param('cabangId') cabangId: string) {
    return this.therapistService.findAllTherapistByCabangId(+cabangId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/checkin')
  checkIn(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.attendanceTherapist({
      therapistId: +id,
      userId,
      attendance: Attendance.CHECKIN,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/checkout')
  checkOut(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.attendanceTherapist({
      therapistId: +id,
      userId,
      attendance: Attendance.CHECKOUT,
    });
  }
}
