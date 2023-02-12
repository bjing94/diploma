import { OrderStatus } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OrderItem, OrderItemSchema } from './order-item.model';

export type OrderDocument = OrderModel & Document;

@Schema()
export class OrderModel {
  constructor(part?: Partial<OrderModel>) {
    Object.assign(this, part);
  }

  id: string;

  @Prop({ type: String })
  status: OrderStatus;

  @Prop({
    type: [OrderItemSchema],
    ref: OrderItem.name,
  })
  orderItems: OrderItem[];

  @Prop()
  paymentId: string;

  // @Prop({
  //   required: false,
  //   default: null,
  //   type: Types.ObjectId,
  //   ref: DeliveryInfo.name,
  // })
  // deliveryInfo: DeliveryInfo;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderModel);
