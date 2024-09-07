import { ApiProperty } from '@nestjs/swagger';
import { Gender, OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  NotEquals,
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

  @IsPhoneNumber('ID')
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ApiProperty()
  treatementDetail: number[];
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  therapistId: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @NotEquals(OrderStatus.PENDING)
  @ApiProperty()
  status: OrderStatus;
}
