import { Product } from '@burger-shop/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MenuItemDocument = MenuItemModel & Document;

@Schema()
export class MenuItemModel {
  constructor(part?: Partial<MenuItemModel>) {
    Object.assign(this, part);
  }

  id: string;

  @Prop()
  available: boolean;

  @Prop()
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
  })
  product: Product;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItemModel);
