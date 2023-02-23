import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = EventModel & Document;

@Schema({ timestamps: true })
export class EventModel {
  constructor(part?: Partial<EventModel>) {
    Object.assign(this, part);
  }

  @Prop()
  public id: string; // object identifier for convenience

  @Prop()
  public name: string;

  @Prop()
  public payload: string;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
