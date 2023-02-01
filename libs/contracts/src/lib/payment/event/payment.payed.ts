import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentPayed {
  export const topic = 'payment.payed.event';

  export class Payload {
    @ApiProperty()
    public readonly id: number;
  }
}
