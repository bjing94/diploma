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

  public async getProductEvents() {
    return this.productModel.find().sort({ createdAt: 'asc' });
  }

  public async getProductEventStream(id: string) {
    return this.productModel.find({ id: id }).sort({ createdAt: 'asc' });
  }

  public async getMenuEventStream(id: string) {
    return this.menuModel.find({ id: id }).sort({ createdAt: 'asc' });
  }
}
