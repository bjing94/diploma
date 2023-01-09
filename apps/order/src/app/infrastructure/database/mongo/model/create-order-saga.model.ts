import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '@burger-shop/interfaces';

export type CreateOrderSagaDocument = CreateOrderSagaModel & Document;

@Schema()
export class CreateOrderSagaModel {
  @Prop()
  public orderId: string;

  @Prop({ type: String })
  public status: OrderStatus;
}

export const CreateOrderSagaSchema =
  SchemaFactory.createForClass(CreateOrderSagaModel);
