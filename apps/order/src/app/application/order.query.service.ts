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
    const order = await this.repository.find(data.orderId);
    if (!order) return;
    order.status = OrderStatus.PAYED;
    const { id, ...rest } = order;
    await this.repository.update(data.orderId, { ...rest });
  }

  async onCompleted(data: OrderCompletedEventPayload) {
    const order = await this.repository.find(data.orderId);
    if (!order) return;
    order.status = OrderStatus.COMPLETED;
    await this.repository.update(data.orderId, order);
  }
}
