import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONNECTION_NAME, ResourceNames } from './event-store.const';
import { ISaveEvent } from './event-store.interface';
import { EventDocument } from './event.model';

@Injectable()
export class EventStoreProductService {
  constructor(
    @InjectModel(ResourceNames.MENU, CONNECTION_NAME)
    private readonly menuModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT, CONNECTION_NAME)
    private readonly productModel: Model<EventDocument>
  ) {}

  public async saveMenuEvent(dto: ISaveEvent) {
    return this.menuModel.create(dto);
  }

  public async saveProductEvent(dto: ISaveEvent) {
    return this.productModel.create(dto);
  }

  public async getMenuEvents() {
    return this.menuModel.find().sort({ createdAt: 'asc' });
  }

  public async getProductEvents(from?: Date, to?: Date) {
    const filter: any = {};
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.productModel.find(filter).sort({ createdAt: 'asc' });
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
    return this.productModel.find(filter).sort({ createdAt: 'asc' });
  }

  public async getMenuEventStream(id: string) {
    return this.menuModel.find({ id: id }).sort({ createdAt: 'asc' });
  }

  public async getEventsCount() {
    const productEvents = await this.productModel.count();
    const menuEvents = await this.menuModel.count();
    return productEvents + menuEvents;
  }
}
