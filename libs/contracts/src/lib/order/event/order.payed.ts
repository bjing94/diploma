import { ApiProperty } from '@nestjs/swagger';

export class OrderPayedEventPayload {
  @ApiProperty()
  orderId: string;
}
