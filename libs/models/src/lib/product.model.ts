import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  constructor(part?: Partial<Product>) {
    Object.assign(this, part);
  }

  id: string;

  @Prop()
  price: number;

  @Prop()
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
