import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseNames } from '../../config/mongoose.config';
import { EventDocument, Event } from '@burger-shop/models';
import OrderEventSourceRepository from '../../infrastructure/database/mongo/repository/order.event-source.repository';
import OrderEventSourceAbstractRepository from '../repository/order.event-source.abstract-repository';

@Injectable()
export default class OrderEventSourceRepositoryProvider {
  public repository: OrderEventSourceAbstractRepository;

  constructor(
    @InjectModel(Event.name, DatabaseNames.eventDB)
    private readonly eventModel: Model<EventDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new OrderEventSourceRepository(this.eventModel);
  }
}
