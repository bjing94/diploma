import {
  DeliveryInfoResponse,
  OrderStatus,
  PaymentInfoResponse,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export namespace OrderGetOrder {
  export const topic = 'order.get-by-id.request';

  export class OrderItem {
    @IsString()
    @ApiProperty()
    public readonly foodId: string;

    @IsNumber()
    @ApiProperty()
    public readonly count: number;
  }

  export class Request {
    @IsString()
    public readonly id: string;
  }

  export class Response {
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: OrderStatus;

    @ApiProperty({ isArray: true })
    orderItems: OrderItem[];

    @ApiProperty()
    paymentInfo: PaymentInfoResponse;

    @ApiProperty()
    deliveryInfo: DeliveryInfoResponse;

    @ApiProperty()
    createdAt: Date;
  }
}
