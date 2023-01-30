import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from '@burger-shop/models';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop()
  level: number;

  @Prop()
  count: number;

  @Prop({ type: Types.ObjectId, ref: Product.name })
  product: Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
