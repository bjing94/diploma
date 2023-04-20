import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { EventDocument } from '@burger-shop/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResourceNames,
  CONNECTION_NAME,
  PaymentEventNames,
  OrderEventNames,
  CookingStockEventNames,
  CookingRequestEventNames,
  ProductEventNames,
  MenuEventNames,
} from 'libs/event-store/src/lib/event-store.const';
import { Model } from 'mongoose';

@Injectable()
export default class EventService {
  constructor(
    @InjectModel(ResourceNames.MENU, CONNECTION_NAME)
    private readonly menuEventModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT, CONNECTION_NAME)
    private readonly productEventModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT + '_snapshot', CONNECTION_NAME)
    private readonly productSnapshotModel: Model<EventDocument>,
    @InjectModel(ResourceNames.MENU + '_snapshot', CONNECTION_NAME)
    private readonly menuSnapshotModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PAYMENT, CONNECTION_NAME)
    private readonly paymentEventModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PAYMENT + '_snapshot', CONNECTION_NAME)
    private readonly paymentSnapshotEventModel: Model<EventDocument>,
    @InjectModel(ResourceNames.ORDER, CONNECTION_NAME)
    private readonly orderEventModel: Model<EventDocument>,
    @InjectModel(ResourceNames.ORDER + '_snapshot', CONNECTION_NAME)
    private readonly orderSnasphotEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_REQUEST, CONNECTION_NAME)
    private readonly cookingRequestEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_REQUEST + '_snapshot', CONNECTION_NAME)
    private readonly cookingRequestSnasphotEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_STOCK, CONNECTION_NAME)
    private readonly cookingStockEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_STOCK + '_snapshot', CONNECTION_NAME)
    private readonly cookingStockSnasphotEventDocument: Model<EventDocument>,
    private readonly kafkaProducerService: KafkaProducerService
  ) {}

  public async getMenuEvents(filter: { from?: Date; to?: Date; id?: string }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.menuEventModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getProductEvents(filter: {
    from?: Date;
    to?: Date;
    id?: string;
  }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.productEventModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getProductEventStream(id: string, from?: Date, to?: Date) {
    const filter: any = { id: id };
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.productEventModel.find(filter).sort({ createdAt: 'asc' });
  }

  public async getPaymentEvents(filter: {
    from?: Date;
    to?: Date;
    id?: string;
  }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.paymentEventModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getPaymentEventStream(id: string) {
    return this.paymentEventModel
      .find({ objectId: id })
      .sort({ createdAt: 'asc' });
  }

  public async getPaymentSnapshots(from?: Date, to?: Date) {
    const filter: any = {};
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.paymentSnapshotEventModel.find(filter);
  }

  public async getOrderEvents(filter: { from?: Date; to?: Date; id?: string }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.orderEventModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getOrderEventStream(filter: {
    id: string;
    from?: Date;
    to?: Date;
  }) {
    const { id, from, to } = filter;
    const mongoFilter: any = { id: id };
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    return this.orderEventModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getCookingRequestEvents(filter: {
    from?: Date;
    to?: Date;
    id?: string;
  }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.cookingRequestEventDocument
      .find(mongoFilter)
      .sort({ createdAt: 'asc' });
  }

  public async getCookingStockEvents(filter: {
    from?: Date;
    to?: Date;
    id?: string;
  }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.cookingStockEventDocument
      .find(mongoFilter)
      .sort({ createdAt: 'asc' });
  }

  public async getCookingStockEventStream(filter: {
    id: string;
    from?: Date;
    to?: Date;
  }) {
    const { id, from, to } = filter;
    const mongoFilter: any = { id: id };
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    return this.cookingRequestEventDocument
      .find(mongoFilter)
      .sort({ createdAt: 'asc' });
  }

  public async runMenuEvents() {
    try {
      await this.kafkaProducerService.sendMenuClearRead();
      const events = await this.getMenuEvents({});
      console.log(`Events:`, events.length, events);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        let topic = '';
        if (event.name === MenuEventNames.menuCreated) {
          topic = EventTopics.menuCreated;
        }
        if (event.name === MenuEventNames.menuActivated) {
          topic = EventTopics.menuUpdated;
        }
        if (event.name === MenuEventNames.menuDeactivated) {
          topic = EventTopics.menuUpdated;
        }
        if (event.name === MenuEventNames.menuItemsUpdated) {
          topic = EventTopics.menuUpdated;
        }
        await this.kafkaProducerService.emit(topic, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async runProductEvents() {
    try {
      await this.kafkaProducerService.sendProductClearRead();
      const events = await this.getProductEvents({});
      console.log(`Events:`, events.length, events);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        let topic = '';
        if (event.name === ProductEventNames.productCreated) {
          topic = EventTopics.productCreated;
        }
        if (event.name === ProductEventNames.productUpdated) {
          topic = EventTopics.productUpdated;
        }

        await this.kafkaProducerService.emit(topic, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async runPaymentEvents() {
    try {
      await this.kafkaProducerService.sendPaymentClearRead();
      const events = await this.getPaymentEvents({});
      console.log(`Events:`, events.length);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        const topic =
          event.name === PaymentEventNames.paymentCreated
            ? EventTopics.paymentCreated
            : EventTopics.paymentStatusUpdated;
        await this.kafkaProducerService.emit(topic, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async runOrderEvents() {
    try {
      await this.kafkaProducerService.sendOrderClearRead();
      const events = await this.getOrderEvents({});
      console.log(`Events:`, events.length);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        const topic =
          event.name === OrderEventNames.orderCreated
            ? EventTopics.orderCreated
            : EventTopics.orderUpdated;
        await this.kafkaProducerService.emit(topic, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  public async runKitchenEvents() {
    try {
      await this.kafkaProducerService.sendKitchenClearRead();
      const stockEvents = await this.getCookingStockEvents({});
      const cookingEvents = await this.getCookingRequestEvents({});
      const events = [...stockEvents, ...cookingEvents];
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        let topic = '';
        if (event.name === CookingStockEventNames.stockCreated) {
          topic = EventTopics.cookingStockCreated;
        }
        if (event.name === CookingStockEventNames.stockQuantityChanged) {
          topic = EventTopics.cookingStockUpdated;
        }
        if (event.name === CookingRequestEventNames.requestCreated) {
          topic = EventTopics.cookingRequestCreated;
        }
        if (event.name === CookingRequestEventNames.requestReady) {
          topic = EventTopics.cookingRequestUpdated;
        }
        if (event.name === CookingRequestEventNames.requestRejected) {
          topic = EventTopics.cookingRequestUpdated;
        }
        await this.kafkaProducerService.emit(topic, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  public async clearKitchenRead() {
    await this.kafkaProducerService.sendKitchenClearRead();
  }

  public async clearOrderRead() {
    await this.kafkaProducerService.sendOrderClearRead();
  }

  public async clearProductRead() {
    await this.kafkaProducerService.sendProductClearRead();
  }

  public async clearPaymentRead() {
    await this.kafkaProducerService.sendPaymentClearRead();
  }

  public async clearMenuRead() {
    await this.kafkaProducerService.sendMenuClearRead();
  }
}
