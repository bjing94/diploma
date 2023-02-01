import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentRefunded {
  export const topic = 'payment.refunded.event';

  export class Payload {
    @ApiProperty()
    public readonly id: number;
  }
}
