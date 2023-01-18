import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  constructor(part?: Partial<Product>) {
    Object.assign(this, part);
  }

  @Prop()
  id: number;

  @Prop()
  price: number;

  @Prop()
  name: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
