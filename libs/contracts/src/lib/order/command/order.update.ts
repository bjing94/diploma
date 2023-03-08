import { OrderStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class OrderUpdateCommandRequest {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({ enum: OrderStatus })
  public readonly status: OrderStatus;
}

export class OrderUpdateCommandResponse {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({ enum: OrderStatus })
  public readonly status: OrderStatus;
}
