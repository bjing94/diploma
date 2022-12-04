import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.model';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop()
  level: number;

  @Prop()
  count: number;

  @Prop()
  product: Product;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
