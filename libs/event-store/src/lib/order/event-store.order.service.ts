import { ISaveEvent } from '@burger-shop/interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResourceNames } from '../event-store.const';
import { EventDocument } from '../event.model';

@Injectable()
export default class OrderEventService {
  constructor(
    @InjectModel(ResourceNames.ORDER)
    private readonly orderEventDocument: Model<EventDocument>,
    @InjectModel(ResourceNames.ORDER + '_snapshot')
    private readonly orderSnasphotEventDocument: Model<EventDocument>
  ) {}

  public saveEvent(event: ISaveEvent) {
    return this.orderEventDocument.create(event);
  }

  public getAllEvents(event: ISaveEvent) {
    return this.orderEventDocument.create(event);
  }

  public async getEvents(filter: { from?: Date; to?: Date; id?: string }) {
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
    return this.orderEventDocument.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getProductEventStream(filter: {
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
    return this.orderEventDocument.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getOrder(id: string) {
    const snapshot = await this.orderSnasphotEventDocument.findOne({
      objectId: id,
    });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    return ProductDomainTransformer.hydrate(events);
  }
}
