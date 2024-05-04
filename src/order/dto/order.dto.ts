import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IsTime } from 'src/utils/validator/time.validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  orderDate: Date;

  @IsNotEmpty()
  @IsTime()
  @ApiProperty()
  orderTime: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  therapistId?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cabangId: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  guestGender: Gender;

  @IsNotEmpty()
  @IsEnum(Gender)
  therapistGender: Gender;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ApiProperty()
  treatementDetail: number[];
}
