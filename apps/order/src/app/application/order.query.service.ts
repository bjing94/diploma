import {
  OrderCreated,
  OrderGetOrder,
  OrderPayed,
} from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import OrderMapper from './mapper/order.mapper';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import OrderRepositoryProvider from './providers/order.repository-provider';

@Injectable()
export default class OrderQueryService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
    private readonly eventSourceProvider: OrderEventSourceRepositoryProvider,
    private readonly orderRepoProvider: OrderRepositoryProvider
  ) {}

  async getOrder(data: OrderGetOrder.Request) {
    // const order = await this.orderRepoProvider.repository.find(data.orderId);
    // return {
    //   id: order.id,
    //   status: order.status,
    // };
  }

  async onCreated(data: OrderCreated.Payload) {
    await this.eventSourceProvider.repository.saveEvent(
      OrderCreated.topic,
      data
    );
    // const order = new OrderDomainEntity(data.id, data.orderItems, '');
    // const dbOrder = OrderMapper.toDatabase(order);
    // await this.orderRepoProvider.repository.create(dbOrder);
  }

  async onPayed(data: OrderPayed.Payload) {
    await this.eventSourceProvider.repository.saveEvent(OrderPayed.topic, data);
    const order = await this.orderRepoProvider.repository.find(data.orderId);
    if (!order) return;
    order.status = OrderStatus.PAYED;
    await this.orderRepoProvider.repository.update(data.orderId, order);
  }

  async onCompleted(data: OrderPayed.Payload) {
    await this.eventSourceProvider.repository.saveEvent(OrderPayed.topic, data);
    const order = await this.orderRepoProvider.repository.find(data.orderId);
    if (!order) return;
    order.status = OrderStatus.COMPLETED;
    await this.orderRepoProvider.repository.update(data.orderId, order);
  }
}
