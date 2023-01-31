import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop()
  level: number;

  @Prop()
  count: number;

  @Prop()
  productId: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
