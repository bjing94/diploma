import { ApiProperty } from '@nestjs/swagger';

export namespace OrderCreate {
  export class OrderItem {
    @ApiProperty()
    public readonly foodId: string;

    @ApiProperty()
    public readonly count: number;
  }
  export class OrderResponse {
    @ApiProperty()
    public readonly orderId: string;
  }

  export const topic = 'order.create.command';

  export class Request {
    @ApiProperty()
    orderItems: OrderItem[];
  }

  export class Response {
    @ApiProperty()
    data: OrderResponse;
  }
}
