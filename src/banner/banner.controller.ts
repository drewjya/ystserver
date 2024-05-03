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
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { v4 as uuidV4 } from 'uuid';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'img',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.');
          const val = uuidV4();
          cb(null, `${val}.${ext[ext.length - 1]}`);
        },
      }),
    }),
  )
  @Post()
  create(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.bannerService.create(file, userId);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.bannerService.remove(+id, userId);
  }
}
