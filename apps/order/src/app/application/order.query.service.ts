import { OrderCreated } from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';

@Injectable()
export default class OrderQueryService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
    private readonly eventSourceProvider: OrderEventSourceRepositoryProvider
  ) {}

  async onCreated(data: OrderCreated.Payload) {
    await this.eventSourceProvider.repository.saveEvent(
      OrderCreated.topic,
      data
    );
  }
}
