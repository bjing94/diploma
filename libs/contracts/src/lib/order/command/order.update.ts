import { OrderStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class OrderUpdateCommandRequest {
  @ApiProperty()
  @IsString()
  public readonly id: string;

  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  public readonly status: OrderStatus;
}

export class OrderUpdateCommandResponse {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({ enum: OrderStatus })
  public readonly status: OrderStatus;
}
