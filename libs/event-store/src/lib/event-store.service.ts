import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONNECTION_NAME, ResourceNames } from './event-store.const';
import { ISaveEvent } from './event-store.interface';
import { EventDocument } from './event.model';

@Injectable()
export class EventStoreService {
  constructor(
    @InjectModel(ResourceNames.MENU, CONNECTION_NAME)
    private readonly menuModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT, CONNECTION_NAME)
    private readonly productModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PAYMENT, CONNECTION_NAME)
    private readonly paymentModel: Model<EventDocument>,
    @InjectModel(ResourceNames.ORDER, CONNECTION_NAME)
    private readonly orderModel: Model<EventDocument>
  ) {}

  public async saveMenuEvent(dto: ISaveEvent) {
    return this.menuModel.create(dto);
  }

  public async saveProductEvent(dto: ISaveEvent) {
    return this.productModel.create(dto);
  }
  public async savePaymentEvent(dto: ISaveEvent) {
    return this.paymentModel.create(dto);
  }

  public async saveOrderEvent(dto: ISaveEvent) {
    return this.orderModel.create(dto);
  }

  public async getMenuEvents() {
    return this.menuModel.find().sort({ createdAt: 'asc' });
  }

  public async getProductEvents() {
    return this.productModel.find().sort({ createdAt: 'asc' });
  }

  public async getPaymentEvents() {
    return this.paymentModel.find().sort({ createdAt: 'asc' });
  }

  public async getOrderEvents() {
    return this.orderModel.find().sort({ createdAt: 'asc' });
  }
}
