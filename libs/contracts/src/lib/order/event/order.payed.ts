import { ApiProperty } from '@nestjs/swagger';

export namespace OrderPayed {
  export const topic = 'order.payed.event';

  export class Payload {
    @ApiProperty()
    orderId: string;
  }
}
