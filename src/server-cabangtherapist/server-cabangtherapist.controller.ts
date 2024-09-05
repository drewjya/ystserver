import {
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import {
  bad_request,
  getUserFromReq,
} from 'src/server-order/server-order.util';
import { ServerCabangtherapistService } from './server-cabangtherapist.service';

@Controller('server/cabangtherapist')
export class ServerCabangtherapistController {
  constructor(private readonly service: ServerCabangtherapistService) {}

  @UseGuards(AccessTokenGuard)
  @Post(':id')
  addTherapistCabang(
    @Req() req: Request,
    @Param('id') therapistId: string,
    @Query('cabang') cabang?: string,
  ) {
    const user = getUserFromReq(req);
    if (!+therapistId) {
      throw bad_request;
    }
    return this.service.addTherapistCabang({
      admin: user,
      therapistId: +therapistId,
      cabangId: +cabang ? +cabang : undefined,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  removeTherapistCabang(
    @Req() req: Request,
    @Param('id') therapistId: string,
    @Query('cabang') cabang?: string,
  ) {
    const user = getUserFromReq(req);
    if (!+therapistId) {
      throw bad_request;
    }
    return this.service.removeTherapistCabang({
      admin: user,
      therapistId: +therapistId,
      cabangId: +cabang ? +cabang : undefined,
    });
  }
}
