import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop()
  price: number;

  @Prop()
  name: string;

  @Prop()
  id: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
