import { DeliveryStatus } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeliveryInfoDocument = DeliveryInfo & Document;

@Schema()
export class DeliveryInfo {
  @Prop()
  tableId: string;

  @Prop()
  status: DeliveryStatus;
}

export const DeliveryInfoSchema = SchemaFactory.createForClass(DeliveryInfo);
