import { ApiProperty } from '@nestjs/swagger';
import { OrderCreatedDto } from './order.created';

export class OrderUpdatedEventPayload {
  @ApiProperty()
  public readonly order: OrderCreatedDto;
}
