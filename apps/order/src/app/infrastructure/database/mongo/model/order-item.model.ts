import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop()
  id: number;

  @Prop()
  quantity: number;

  @Prop()
  productId: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
