/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStoreService } from '@burger-shop/event-store';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
    private readonly eventStoreService: EventStoreService
  ) {}

  async loadOrderEvents() {
    try {
      const events = await this.eventStoreService.getEvents();
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        await this.kafkaProducer.emit(event.name, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
