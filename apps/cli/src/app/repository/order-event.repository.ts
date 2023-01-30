import { Model } from 'mongoose';
import { EventDocument } from '@burger-shop/models';
import OrderEventSourceAbstractRepository from './order.event-source.abstract-repository';
import { IEvent } from '@burger-shop/interfaces';

export default class OrderEventSourceRepository
  implements OrderEventSourceAbstractRepository
{
  private _repository: Model<EventDocument>;

  constructor(repository: Model<EventDocument>) {
    this._repository = repository;
  }

  public async getAllEvents(): Promise<IEvent[]> {
    const events = await this._repository.find();
    return events;
  }

  public async saveEvent(
    type: string,
    data: any
  ): Promise<{ eventId: string }> {
    const newEvent = await this._repository.create({ type: type, data: data });
    return { eventId: newEvent._id.toString() };
  }
  public async getEvent(id: string): Promise<{ type: string; data: any }> {
    return { type: 'fgfd', data: {} };
  }
}
