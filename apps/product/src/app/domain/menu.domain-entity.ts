import { Types } from 'mongoose';
import MenuItemDomainEntity from './menu-item.domain-entity';

export default class MenuDomainEntity {
  private _id: string;

  private _items: MenuItemDomainEntity[];

  constructor(items: MenuItemDomainEntity[], id?: string) {
    this.id = id ?? new Types.ObjectId(id).toString();
    this.items = items;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get items(): MenuItemDomainEntity[] {
    return this._items;
  }
  public set items(value: MenuItemDomainEntity[]) {
    this._items = value;
  }

  public async addItem(item: MenuItemDomainEntity) {
    this.items.push(item);
  }

  public async removeItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
