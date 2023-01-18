import { OrderStatus } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DeliveryInfo } from './delivery-info.model';
import { OrderItem } from './order-item.model';
import { PaymentInfo } from './payment-info.model';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop({ type: String })
  status: OrderStatus;

  @Prop({
    type: [Types.ObjectId],
    ref: OrderItem.name,
  })
  orderItems: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: PaymentInfo.name,
  })
  paymentInfo: Types.ObjectId;

  @Prop({
    required: false,
    default: null,
    type: Types.ObjectId,
    ref: DeliveryInfo.name,
  })
  deliveryInfo: DeliveryInfo;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
