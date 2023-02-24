import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, Document } from 'mongoose';
import { MenuItemModel, MenuItemSchema } from './menu-item.model';

export type SnapshotDocument = SnapshotModel & Document;

@Schema({ timestamps: true })
export class SnapshotModel {
  constructor(part?: Partial<SnapshotModel>) {
    Object.assign(this, part);
  }

  @Prop()
  eventsCount: number;

  id: string;

  createdAt: Date;
  updatedAt: Date;
}

export const SnapshotSchema = SchemaFactory.createForClass(SnapshotModel);
