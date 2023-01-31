import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export namespace OrderComplete {
  export const topic = 'order.complete.command';

  export class Request {
    @ApiProperty()
    @IsString()
    public orderId: string;
  }

  export class Response {
    @ApiProperty()
    public readonly result: boolean;
  }
}
