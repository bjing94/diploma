import { CookingRequestStatus } from '@burger-shop/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CookingRequestDocument = CookingRequestModel & Document;

@Schema()
export class CookingRequestModel {
  @Prop()
  public readonly productId: string;
  @Prop({ type: String })
  public readonly status: CookingRequestStatus;
}

export const CookingRequestSchema =
  SchemaFactory.createForClass(CookingRequestModel);
