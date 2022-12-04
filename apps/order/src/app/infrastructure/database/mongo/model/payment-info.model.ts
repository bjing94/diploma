import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaymentInfoDocument = PaymentInfo & Document;

@Schema()
export class PaymentInfo {
  @Prop()
  public status: PaymentStatus;

  @Prop()
  public total: number;

  @Prop()
  public type: PaymentType;
}

export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
