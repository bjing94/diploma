import { ProductDomainEntity } from '@burger-shop/domain-entities';

export default class MenuItemDomainEntity {
  private _id: number;
  private _product: ProductDomainEntity;
  private _available: boolean;
  private _price: number;

  constructor(
    product: ProductDomainEntity,
    available: boolean,
    price: number,
    id: number
  ) {
    this.product = product;
    this.available = available;
    this.price = price;
    this.id = id;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }
  public get product(): ProductDomainEntity {
    return this._product;
  }
  public set product(value: ProductDomainEntity) {
    this._product = value;
  }
  public get available(): boolean {
    return this._available;
  }
  public set available(value: boolean) {
    this._available = value;
  }
  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }
}
