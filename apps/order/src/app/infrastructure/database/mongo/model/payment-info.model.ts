import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PaymentInfoDocument = PaymentInfo & Document;

@Schema()
export class PaymentInfo {
  @Prop({ type: String })
  public id: string;

  @Prop({ type: String })
  public status: PaymentStatus;

  @Prop()
  public total: number;

  @Prop({ type: String })
  public type: PaymentType;
}

export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
