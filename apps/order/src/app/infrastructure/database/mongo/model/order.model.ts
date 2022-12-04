import { OrderStatus } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeliveryInfo } from './delivery-info.model';
import { OrderItem } from './order-item.model';
import { PaymentInfo } from './payment-info.model';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  status: OrderStatus;

  @Prop()
  orderItems: OrderItem[];

  @Prop()
  paymentInfo: PaymentInfo;

  @Prop({ required: false, default: null })
  deliveryInfo: DeliveryInfo;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
