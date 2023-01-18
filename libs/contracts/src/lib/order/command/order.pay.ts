import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export namespace OrderPay {
  export const topic = 'order.pay.command';

  export class Request {
    @ApiProperty()
    @IsString()
    public orderId: string;
  }

  export class Response {
    @ApiProperty()
    public readonly orderId: string;
  }
}
