import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  happyHourPrice: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  optional: boolean;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  happyHourPrice: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  optional: boolean;
}
