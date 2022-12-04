import {
  OrderStatus,
  PaymentInfoResponse,
  DeliveryInfoResponse,
  OrderItemResponse,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export namespace OrderCreated {
  export const topic = 'order.created.event';

  export class Payload {
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: OrderStatus;

    @ApiProperty({ isArray: true })
    orderItems: OrderItemResponse[];

    // @ApiProperty()
    // paymentInfo: PaymentInfoResponse;

    // @ApiProperty()
    // deliveryInfo: DeliveryInfoResponse;

    @ApiProperty()
    createdAt: Date;
  }
}
