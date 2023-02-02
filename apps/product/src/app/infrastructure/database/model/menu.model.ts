import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MenuItemModel } from './menu-item.model';

export type MenuDocument = MenuModel & Document;

@Schema()
export class MenuModel {
  constructor(part?: Partial<MenuModel>) {
    Object.assign(this, part);
  }

  @Prop()
  id: number;

  @Prop({
    type: [Types.ObjectId],
    ref: MenuItemModel.name,
  })
  items: MenuItemModel[];
}

export const MenuSchema = SchemaFactory.createForClass(MenuModel);
