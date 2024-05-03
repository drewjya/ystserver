import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCabangTreatmentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cabangId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  treatmentId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  harga: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  happyHourPrice: number;
}

export class UpdateCabangTreatmentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  harga: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  happyHourPrice: number;
}
