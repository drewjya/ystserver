import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { getUserFromReq } from 'src/server-order/server-order.util';
import { ApiException } from 'src/utils/exception/api.exception';
import { CreateNewAdmin, DeleteAdmin, EditAdmin } from './server-admin.entity';
import { ServerAdminService } from './server-admin.service';

@Controller('server/admin')
export class ServerAdminController {
  constructor(private readonly service: ServerAdminService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAdminList(@Req() req: Request) {
    console.log(req.user);

    return this.service.findAdminList();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createNewAdmin(@Req() req: Request, @Body() body: CreateNewAdmin) {
    const user = getUserFromReq(req);
    return this.service.createNewAdmin({
      user: user,
      body: body,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  editAdmin(@Req() req: Request, @Body() body: EditAdmin) {
    const user = getUserFromReq(req);
    return this.service.editAdmin({
      user: user,
      body: body,
    });
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteAdmin(
    @Req() req: Request,
    @Body() body: DeleteAdmin,
    @Param('id') adminId: string,
  ) {
    const user = getUserFromReq(req);
    const id = +adminId;
    if (!id) {
      throw new ApiException({
        data: 'bad_request',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return this.service.deleteAdmin({
      user: user,
      body: body,
      adminId: id,
    });
  }
}
