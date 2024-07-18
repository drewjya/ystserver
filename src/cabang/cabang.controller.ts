import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { parseFile } from 'src/utils/pipe/file.pipe';
import { CabangService } from './cabang.service';
import { CreateCabangDto } from './dto/cabang.dto';

@Controller('cabang')
export class CabangController {
  constructor(private readonly cabangService: CabangService) {}

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(uploadConfig())
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
    const userId = checkRole(req, Role.SUPERADMIN);

    return this.cabangService.create({ createCabangDto, userId, file });
  }

  @Get()
  findAll(@Query("limit") limit: string) {
    let val = null
    if (+limit) {
      val = +limit
    }
    return this.cabangService.findAll(val);
  }

  @Get('category/:categoryName')
  findByCategory(@Param('categoryName') categoryName: string) {
    return this.cabangService.findByCategory(categoryName);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.cabangService.findOne(+id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  @UseInterceptors(uploadConfig())
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
    const userId = checkRole(req, Role.SUPERADMIN);

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
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.cabangService.remove(+id, userId);
  }
}
