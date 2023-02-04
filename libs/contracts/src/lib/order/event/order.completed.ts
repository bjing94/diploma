import { ApiProperty } from '@nestjs/swagger';

export class OrderCompletedEventPayload {
  @ApiProperty()
  orderId: string;
}
