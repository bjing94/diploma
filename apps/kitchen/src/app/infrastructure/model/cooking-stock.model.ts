import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CookingStockDocument = CookingStockModel & Document;

@Schema()
export class CookingStockModel {
  @Prop({ unique: true })
  public readonly productId: string;
  @Prop()
  public readonly quantity: number;
}

export const CookingStockSchema =
  SchemaFactory.createForClass(CookingStockModel);
