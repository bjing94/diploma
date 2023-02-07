import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISaveEvent } from './event-store.interface';
import { EventDocument, EventModel } from './event.model';

@Injectable()
export class EventStoreService {
  constructor(
    @InjectModel(EventModel.name) private readonly model: Model<EventDocument>
  ) {}

  public async saveEvent(dto: ISaveEvent) {
    return this.model.create(dto);
  }

  public async getEvents() {
    return this.model.find().sort({ createdAt: 'asc' });
  }
}