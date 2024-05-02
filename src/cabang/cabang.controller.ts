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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ApiException } from 'src/utils/exception/api.exception';
import { parseFile } from 'src/utils/pipe/file.pipe';
import { v4 as uuidV4 } from 'uuid';
import { CabangService } from './cabang.service';
import { CreateCabangDto } from './dto/cabang.dto';

@Controller('cabang')
export class CabangController {
  constructor(private readonly cabangService: CabangService) {}

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
  create(
    @Body() createCabangDto: CreateCabangDto,
    @Req() req: Request,
    @UploadedFile(
      parseFile({
        isRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    console.log(file);

    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }

    return this.cabangService.create({ createCabangDto, userId, file });
  }

  @Get()
  findAll() {
    return this.cabangService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cabangService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
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
  update(
    @Param('id') id: string,
    @Body() updateCabangDto: CreateCabangDto,
    @Req() req: Request,
    @UploadedFile(
      parseFile({
        isRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }

    return this.cabangService.update({
      userId: userId,
      updateCabangDto: updateCabangDto,
      id: +id,
      file: file,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }
    return this.cabangService.remove(+id, userId);
  }
}
