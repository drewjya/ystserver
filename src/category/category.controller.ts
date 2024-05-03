import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/access-token.guard';
import { checkRole } from 'src/utils/extract/request.extract';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.categoryService.create(createCategoryDto, userId);
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
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.categoryService.update(+id, updateCategoryDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = checkRole(req, Role.SUPERADMIN);
    return this.categoryService.remove(+id, userId);
  }
}
