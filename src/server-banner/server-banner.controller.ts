import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { uploadConfig } from 'src/config/upload.config';
import { checkRole } from 'src/utils/extract/request.extract';
import { ServerBannerService } from './server-banner.service';

@Controller('server/banner')
export class ServerBannerController {
  constructor(private readonly service: ServerBannerService) {}

  @Get()
  findAll() {
    return this.service.findAllBanner();
  }
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    uploadConfig({
      directory: 'banner',
    }),
  )
  @Post()
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.service.create(file, userId);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.service.remove(+id, userId);
  }
}
