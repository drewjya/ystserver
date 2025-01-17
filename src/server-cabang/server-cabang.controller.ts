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
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { uploadConfig } from 'src/config/upload.config';
import {
  bad_request,
  getUserFromReq,
} from 'src/server-order/server-order.util';
import { parseFile } from 'src/utils/pipe/file.pipe';
import { CreateCabangDto } from './server-cabang.dto';
import { ServerCabangService } from './server-cabang.service';

@Controller('server/cabang')
export class ServerCabangController {
  constructor(private readonly service: ServerCabangService) {}

  @UseGuards(AccessTokenGuard)
  @Get('')
  async findCabangList(
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
    @Query('query') query: string,
  ) {
    return this.service.findCabangList({
      query: query,
      cursor: +cursor,
      limit: +limit ? +limit : 6,
    });
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(uploadConfig({ directory: 'cabang' }))
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
    const userId = getUserFromReq(req);
    return this.service.createCabang({
      body: createCabangDto,
      user: userId,
      file: file,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getCabangDetail(@Req() req: Request, @Param('id') cabang_Id: string) {
    if (!+cabang_Id) {
      throw bad_request;
    }
    return this.service.findCabangForm(+cabang_Id);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(uploadConfig({ directory: 'cabang' }))
  @Put(':id')
  editCabang(
    @Body() createCabangDto: CreateCabangDto,
    @Req() req: Request,
    @Param('id') cabang_Id: string,
    @UploadedFile(
      parseFile({
        isRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const userId = getUserFromReq(req);
    if (!+cabang_Id) {
      throw bad_request;
    }
    return this.service.editCabang({
      body: createCabangDto,
      user: userId,
      file: file,
      cabangId: +cabang_Id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteCabang(@Req() req: Request, @Param('id') id: string) {
    const userId = getUserFromReq(req);
    const cabangId = +id;
    if (!cabangId) {
      throw bad_request;
    }
    return this.service.deleteCabang({
      user: userId,
      cabangId,
    });
  }
}
