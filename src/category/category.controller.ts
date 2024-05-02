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
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { ApiException } from 'src/utils/exception/api.exception';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const userId = req.user['sub'];
    const role = req.user['role'];

    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request,
  ) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user['sub'];
    const role = req.user['role'];
    if (role !== Role.SUPERADMIN) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'unauthorized');
    }
  }
}
