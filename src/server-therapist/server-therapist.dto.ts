import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@prisma/client";
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber } from "class-validator";

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
  }