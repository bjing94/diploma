import MenuItemDomainEntity from './menu-item.domain-entity';

export default class MenuDomainEntity {
  private _id: number;

  private _items: MenuItemDomainEntity[];

  constructor(items: MenuItemDomainEntity[], id: number) {
    this.id = id;
    this.items = items;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
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
