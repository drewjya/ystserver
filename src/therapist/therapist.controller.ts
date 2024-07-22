import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AddTreatmentDto,
  CreateTherapistDto,
  UpdateTherapistDto,
} from './dto/therapist.dto';

import { Gender, Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ApiException } from 'src/utils/exception/api.exception';
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

  
  @Get('query')
  queryTherapistName(
    @Query('cabangId') cabangId: string,
    @Query('name') name: string,
    @Query('gender') gender: Gender,
    @Req() req: Request,
  ) {
    return this.therapistService.findingTherapistByCabangTreatmentName({
      cabangId: +cabangId,
      name: name,
      gender: gender,
    });
  }
  @Get('cabang/:cabangId')
  findByCabang(@Param('cabangId') cabangId: string) {
    return this.therapistService.findAllTherapistByCabangId(+cabangId);
  }

  @Get('timeslot/:cabangId')
  findTherapistByTimeslot(
    @Param('cabangId') cabangId: string,
    @Query('date') date: string,
    @Query('therapistId') therapistId?: string,
  ) {
    let val: {
      cabangId: number;
      date: string;
      therapistId?: number;
    } = {
      cabangId: +cabangId,
      date,
      therapistId: therapistId ? +therapistId : null,
    };
    return this.therapistService.generateTimeSlot(val);
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

  @UseGuards(AccessTokenGuard)
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
    return this.therapistService.treatmentProcess({
      therapistId: +id,
      isAdd: true,
      tagsId: body.tagsId,
      userId: userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/treatment/remove/:tagId')
  removeTreatment(
    @Param('id') id: string,
    @Param('tagId') tagId: string,
    @Req() req: Request,
  ) {
    if (!+tagId) {
      throw new ApiException({
        data: 'TreatmentId must be a number',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.treatmentProcess({
      isAdd: false,
      therapistId: +id,
      tagsId: +tagId,
      userId: userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/attendance')
  async getAttendance(@Param('id') id: string) {
    return this.therapistService.findAllAtendanceByTherapist(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/checkin')
  checkIn(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, [Role.SUPERADMIN, Role.ADMIN]);
    return this.therapistService.attendanceTherapist({
      therapistId: +id,
      userId,
      attendance: Attendance.CHECKIN,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(':id/checkout')
  checkOut(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, [Role.SUPERADMIN, Role.ADMIN]);
    return this.therapistService.attendanceTherapist({
      therapistId: +id,
      userId,
      attendance: Attendance.CHECKOUT,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/rating')
  byrating(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.therapistService.findingRatingTherapist(+id, userId);
  }
}
