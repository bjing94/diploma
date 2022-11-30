import {
  DeliveryInfoResponse,
  OrderItemResponse,
  OrderStatus,
  PaymentInfoResponse,
} from '@burger-shop/interfaces';

export namespace OrderGetOrder {
  export const topic = 'order.get-by-id.request';

  export class Request {
    public readonly id: string;
  }

  export class Response {
    id: string;

    status: OrderStatus;

    orderItems: OrderItemResponse[];

    paymentInfo: PaymentInfoResponse;

    deliveryInfo: DeliveryInfoResponse;

    createdAt: Date;
  }
}
