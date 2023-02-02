import { ApiProperty } from '@nestjs/swagger';
import { PaymentCreatedDto } from '../event/payment.created';

export namespace PaymentGet {
  export const topic = 'payment.get.query';
  export class Request {
    @ApiProperty()
    public readonly id: number;
  }

  export class Response {
    @ApiProperty()
    public readonly payment: PaymentCreatedDto;
  }
}
