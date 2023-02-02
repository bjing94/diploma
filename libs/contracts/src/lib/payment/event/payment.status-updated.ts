import { PaymentStatus } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentStatusUpdated {
  export const topic = 'payment.payed.event';

  export class Payload {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly status: PaymentStatus;
  }
}
