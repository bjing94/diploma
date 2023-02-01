import { ApiProperty } from '@nestjs/swagger';

export namespace PaymentFulfill {
  export const topic = 'payment.fulfill.command';

  export class Request {
    @ApiProperty()
    public readonly id: number;

    @ApiProperty()
    public readonly hash: string;
  }

  export class Response {
    @ApiProperty()
    public readonly success: boolean;
  }
}
