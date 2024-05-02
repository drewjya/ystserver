import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
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
}

export class UpdateCabangDto {
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
}
