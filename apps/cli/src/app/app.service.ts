/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaConfig } from './config/provide-kafka-config';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';

@Injectable()
export class AppService {
  constructor(
    private readonly orderEventRepoProvider: OrderEventSourceRepositoryProvider,
    @Inject(kafkaConfig.clientName) private readonly kafka: ClientKafka
  ) {}

  async loadOrderEvents() {
    // const repository = this.orderEventRepoProvider.repository;
    // const events = await repository.getAllEvents();
    // console.log(events.length);
    // for (const event of events) {
    //   await this.kafka.emit(event.type, event.data);
    // }
  }
}
