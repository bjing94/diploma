import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentRejected {
  export const topic = 'payment.rejected.event';

  export class Payload {
    @ApiProperty()
    public readonly id: number;
  }
}
