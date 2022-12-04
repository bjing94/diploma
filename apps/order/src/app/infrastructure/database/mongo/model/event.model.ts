import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, SchemaTypes } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop()
  type: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: any;
}

export const EventSchema = SchemaFactory.createForClass(Event);
