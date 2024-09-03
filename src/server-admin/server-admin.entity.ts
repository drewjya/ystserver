import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNewAdmin {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cabangId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class EditAdmin {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  adminId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cabangId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class DeleteAdmin {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cabangId: number;
}
