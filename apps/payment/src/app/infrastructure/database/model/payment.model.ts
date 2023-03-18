import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaymentDocument = PaymentModel & Document;

@Schema()
export default class PaymentModel {
  public _id: string;

  @Prop({ type: String })
  public status: PaymentStatus;

  @Prop()
  public sum: number;

  @Prop({ type: String })
  public type: PaymentType;

  @Prop()
  public orderId: string;

  @Prop({ required: false })
  public link?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentModel);
