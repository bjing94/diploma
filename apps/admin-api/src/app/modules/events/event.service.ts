import { KafkaProducerService } from '@burger-shop/kafka-module';
import { EventDocument } from '@burger-shop/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResourceNames,
  CONNECTION_NAME,
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
    private readonly cookingStockSnasphotEventDocument: Model<EventDocument>
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
}
