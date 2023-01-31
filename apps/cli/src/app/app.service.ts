/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import getMongoEventStoreConnectionStringOrder, {
  DatabaseNames,
} from '../config/mongoose.config';
import { kafkaConfig } from './config/provide-kafka-config';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import { KafkaProducerService } from '@burger-shop/kafka-module';

@Injectable()
export class AppService {
  constructor(
    private readonly orderEventRepoProvider: OrderEventSourceRepositoryProvider,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  async loadOrderEvents() {
    const repository = this.orderEventRepoProvider.repository;
    const events = await repository.getAllEvents();
    for (const event of events) {
      await this.kafkaProducer.emit(event.type, event.data);
    }
    return;
  }
}
