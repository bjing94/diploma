import {
  OrderCompletedEventPayload,
  OrderCreatedEventPayload,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderPayedEventPayload,
} from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Injectable()
export default class OrderQueryService {
  constructor(
    @Inject('OrderRepository')
    private readonly repository: OrderAbstractRepository
  ) {}

  async getOrder(data: OrderGetQueryRequest): Promise<OrderGetQueryResponse> {
    return this.repository.find(data.id);
  }

  async onCreated(data: OrderCreatedEventPayload) {
    // const order = new OrderDomainEntity(data.id, data.orderItems, '');
    await this.repository.create(data.order);
    // const dbOrder = OrderMapper.toDatabase(order);
    // await this.orderRepoProvider.repository.create(dbOrder);
  }

  async onPayed(data: OrderPayedEventPayload) {
    const result = await this.repository.update(data.orderId, {
      status: OrderStatus.PAYED,
    });
    console.log('Updated order', result);
  }

  async onCompleted(data: OrderCompletedEventPayload) {
    const result = await this.repository.update(data.orderId, {
      status: OrderStatus.COMPLETED,
    });
    console.log('Updated order', result);
  }
}
