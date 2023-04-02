import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = EventModel & Document;

@Schema({ timestamps: true })
export class EventModel {
  constructor(part?: Partial<EventModel>) {
    Object.assign(this, part);
  }

  public id: string;

  @Prop()
  public objectId: string; // object identifier for convenience

  @Prop()
  public name: string;

  @Prop()
  public payload: string;

  public createdAt: Date;
  public updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
