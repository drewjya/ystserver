import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
