import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentCreated {
  export const topic = 'payment.created.event';

  export class Payload {
    @ApiProperty()
    public readonly payment: PaymentCreatedDto;
  }
}

export interface PaymentCreatedDto {
  id: number;
  link?: string;
  status: PaymentStatus;
  sum: number;
  type: PaymentType;
}
