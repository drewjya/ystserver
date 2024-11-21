import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HappyHourDetailDto } from 'src/happy-hour/dto/happy-hour.json';
import { IsTime } from 'src/utils/validator/time.validator';

export class CreateCabangDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('ID')
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsTime()
  @ApiProperty()
  openHour: string;

  @IsNotEmpty()
  @IsString()
  @IsTime()
  @ApiProperty()
  closeHour: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  alamat: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  publicHoliday: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  @ArrayMinSize(1)
  @Type(() => HappyHourDetailDto)
  detail: HappyHourDetailDto[];
}
