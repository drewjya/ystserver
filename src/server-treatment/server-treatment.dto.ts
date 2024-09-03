import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTreatmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tag: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  durasi: number;
}
