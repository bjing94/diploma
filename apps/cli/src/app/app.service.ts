/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStoreProductService } from '@burger-shop/event-store';

@Injectable()
export class AppService {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
    private readonly eventStoreService: EventStoreProductService
  ) {}

  // async loadOrderEvents() {
  //   try {
  //     const events = await this.eventStoreService.getOrderEvents();
  //     console.log('Order events:', events);
  //     // for (const event of events) {
  //     //   await new Promise((res, rej) => {
  //     //     setTimeout(() => {
  //     //       res(true);
  //     //     }, 200);
  //     //   });
  //     //   await this.kafkaProducer.emit(event.name, event.payload);
  //     // }
  //     return;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async loadProductEvents(id: string) {
    try {
      const events = await this.eventStoreService.getProductEventStream(id);
      console.log(`Product event stream for ${id}:`, events);
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

  async loadProductEventsMany() {
    try {
      const events = await this.eventStoreService.getProductEvents();
      console.log('Product events:', events);
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
