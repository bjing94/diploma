import { OrderStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreatedItemDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  price: number;
}

export class OrderCreatedDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly status: OrderStatus;

  @ApiProperty()
  public readonly orderItems: OrderCreatedItemDto[];

  @ApiProperty()
  public readonly paymentId: string;

  @ApiProperty()
  public readonly deliveryId?: string;
}
export class OrderCreatedEventPayload {
  @ApiProperty()
  public readonly order: OrderCreatedDto;

  @ApiProperty()
  public readonly eventName: string;
}
