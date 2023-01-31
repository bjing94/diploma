import { Event, EventDocument } from '@burger-shop/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseNames } from '../../config/mongoose.config';
import OrderEventSourceRepository from '../repository/order-event.repository';
import OrderEventSourceAbstractRepository from '../repository/order.event-source.abstract-repository';

@Injectable()
export default class OrderEventSourceRepositoryProvider {
  public repository: OrderEventSourceAbstractRepository;

  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new OrderEventSourceRepository(this.eventModel);
  }
}
