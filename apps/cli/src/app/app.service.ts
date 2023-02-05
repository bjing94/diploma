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
import { EventStoreService } from '@burger-shop/event-store';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
    private readonly eventStoreService: EventStoreService
  ) {}

  async loadOrderEvents() {
    const events = await this.eventStoreService.getEvents();
    for (const event of events) {
      await this.kafkaProducer.emit(event.name, event.payload);
    }
    return;
  }
}
