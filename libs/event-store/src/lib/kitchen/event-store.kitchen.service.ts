import { ISaveEvent } from '@burger-shop/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONNECTION_NAME, ResourceNames } from '../event-store.const';
import { EventDocument } from '../event.model';
import CookingRequestDomainTransformer from './cooking-request.domain-transformer';
import CookingStockDomainTransformer from './cooking-stock.domain-transformer';

@Injectable()
export class EventStoreKitchenService {
  constructor(
    @InjectModel(ResourceNames.COOKING_REQUEST, CONNECTION_NAME)
    private readonly cookingRequestEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_REQUEST + '_snapshot', CONNECTION_NAME)
    private readonly cookingRequestSnasphotEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_STOCK, CONNECTION_NAME)
    private readonly cookingStockEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.COOKING_STOCK + '_snapshot', CONNECTION_NAME)
    private readonly cookingStockSnasphotEventDocument: Model<EventDocument>
  ) {}

  public saveCookingStockEvent(event: ISaveEvent) {
    return this.cookingStockEventDocument.create(event);
  }

  public saveCookingRequestEvent(event: ISaveEvent) {
    return this.cookingRequestEventDocument.create(event);
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

  public async getCookingStock(id: string) {
    const snapshot = await this.cookingStockSnasphotEventDocument.findOne({
      objectId: id,
    });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getCookingStockEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    if (events.length === 0) return null;
    return CookingStockDomainTransformer.hydrate(events);
  }

  public async getCookingRequest(id: string) {
    const snapshot = await this.cookingRequestSnasphotEventDocument.findOne({
      objectId: id,
    });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getCookingRequestEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    if (events.length === 0) return null;
    return CookingRequestDomainTransformer.hydrate(events);
  }
}
