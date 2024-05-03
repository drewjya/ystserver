import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsTime } from 'src/utils/validator/time.validator';

export class HappyHourDetailDto {
  @IsNotEmpty()
  @Min(1)
  @Max(7)
  @IsNumber()
  startDay: number;

  @IsNotEmpty()
  @Min(1)
  @Max(7)
  @IsNumber()
  endDay: number;

  @IsNotEmpty()
  @IsTime()
  startHour: string;

  @IsNotEmpty()
  @IsTime()
  endHour: string;
}

export class CreateHappyHourDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  publicHoliday: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => HappyHourDetailDto)
  happyHourDetail: HappyHourDetailDto[];
}

export class UpdateHappyHourDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  publicHoliday: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => HappyHourDetailDto)
  happyHourDetail: HappyHourDetailDto[];
}
