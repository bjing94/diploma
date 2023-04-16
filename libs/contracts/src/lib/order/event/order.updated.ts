import { OrderStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class OrderUpdatedEventPayload {
  @ApiProperty()
  public readonly order: { id: string; status: OrderStatus };
  @ApiProperty()
  public readonly eventName: string;
}
