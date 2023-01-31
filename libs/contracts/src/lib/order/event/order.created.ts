import {
  OrderStatus,
  PaymentInfoResponse,
  DeliveryInfoResponse,
  OrderItemResponse,
} from '@burger-shop/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { OrderCreate } from '../command/order.create';

export namespace OrderCreated {
  export const topic = 'order.created.event';

  export class Payload {
    public readonly order: OrderDomainEntity;
  }
}
