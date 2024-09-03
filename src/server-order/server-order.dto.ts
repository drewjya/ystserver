import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, NotEquals } from 'class-validator';

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
