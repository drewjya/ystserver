import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsPhoneNumber('ID')
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  @ApiProperty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}

export class EditProfileDtO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty()
  gender: Gender;

  @IsPhoneNumber('ID')
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}

export class FirebaseTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}

export class ForgetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  otp: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
