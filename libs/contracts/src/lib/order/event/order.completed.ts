import { ApiProperty } from '@nestjs/swagger';

export namespace OrderCompleted {
  export const topic = 'order.completed.event';

  export class Payload {
    @ApiProperty()
    orderId: string;
  }
}
