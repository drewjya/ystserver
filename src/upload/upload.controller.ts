import { Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { uploadConfig } from 'src/config/upload.config';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }


  // @UseGuards(AccessTokenGuard)
  @Post('skilltag')
  @UseInterceptors(uploadConfig())
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,

  ) {
    // const userId = req.user['sub'];
    const jsonData = await this.uploadService.processData(file.path);

  }

}
