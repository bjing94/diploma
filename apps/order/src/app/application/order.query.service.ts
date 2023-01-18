import { OrderCreated, OrderPayed } from '@burger-shop/contracts';
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

  async onCreated(data: OrderCreated.Payload) {
    await this.eventSourceProvider.repository.saveEvent(
      OrderCreated.topic,
      data
    );
    const order = new OrderDomainEntity(data.id, [], '');
    const dbOrder = OrderMapper.toDatabase(order);
    await this.orderRepoProvider.repository.create(dbOrder);
    // Save to read database
  }

  async onPayed(data: OrderPayed.Payload) {
    await this.eventSourceProvider.repository.saveEvent(OrderPayed.topic, data);

    // Save to read database
  }
}
