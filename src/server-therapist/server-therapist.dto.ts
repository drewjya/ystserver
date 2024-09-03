import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTherapistDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cabang?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  no?: string;

  @IsArray()
  @ApiProperty()
  @ArrayMinSize(1)
  skillTags: number[];
}
