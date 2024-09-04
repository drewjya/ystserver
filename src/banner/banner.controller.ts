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
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(uploadConfig())
  @Post()
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.bannerService.create(file, userId);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.bannerService.remove(+id, userId);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

}
