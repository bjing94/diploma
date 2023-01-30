import { Model } from 'mongoose';
import OrderEventSourceAbstractRepository from '../../../../application/repository/order.event-source.abstract-repository';
import {
  EventDocument,
  Event,
} from '../../../../../../../../libs/models/src/lib/event.model';

export default class OrderEventSourceRepository
  implements OrderEventSourceAbstractRepository
{
  private _repository: Model<EventDocument>;

  constructor(repository: Model<EventDocument>) {
    this._repository = repository;
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
