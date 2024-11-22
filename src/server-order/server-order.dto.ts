import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, NotEquals } from 'class-validator';
import { IsTime } from 'src/utils/validator/time.validator';

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


  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  orderDate: Date;

  @IsNotEmpty()
  @IsTime()
  @ApiProperty()
  orderTime: string;

  
}
