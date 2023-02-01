import { PaymentType } from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentCreate {
  export const topic = 'payment.create.command';

  export class Request {
    @ApiProperty()
    public readonly sum: number;

    @ApiProperty()
    public readonly type: PaymentType;
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;

    @ApiProperty()
    public readonly id: number;
  }
}
