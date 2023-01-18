import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from './product.model';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop()
  level: number;

  @Prop()
  count: number;

  @Prop({ type: Types.ObjectId, ref: Product.name })
  product: Product;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
