import { Product } from '@burger-shop/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type MenuItemDocument = MenuItemModel & Document;

@Schema()
export class MenuItemModel {
  constructor(part?: Partial<MenuItemModel>) {
    Object.assign(this, part);
  }

  @Prop()
  id: number;

  @Prop({
    type: [Types.ObjectId],
    ref: Product.name,
  })
  product: Product;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItemModel);
