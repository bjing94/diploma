import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EventDocument,
  Event,
} from '../../infrastructure/database/mongo/model/event.model';
import OrderEventSourceRepository from '../../infrastructure/database/mongo/repository/order.event-source.repository';
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
