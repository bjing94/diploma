import { ProductDomainEntity } from '@burger-shop/domain-entity';

export default class MenuItemDomainEntity {
  private _id: number;
  private _productId: string;
  private _available: boolean;
  private _price: number;

  constructor(product: string, available: boolean, price: number, id: number) {
    this.productId = product;
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
  public get productId(): string {
    return this._productId;
  }
  public set productId(value: string) {
    this._productId = value;
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
