import { ProductDomainEntity } from '@burger-shop/domain-entities';

export default class OrderItemDomainEntity {
  private _id: number;
  private _quantity: number;
  private _product: { name: string; price: number; id: string };

  constructor(data: {
    quantity: number;
    product: { name: string; price: number; id: string };
    id?: number;
  }) {
    this.quantity = data.quantity;
    this.product = data.product;
    this.id = data.id;
  }

  get totalPrice(): number {
    return this.product.price * this.quantity;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public set quantity(value: number) {
    this._quantity = value;
  }

  public get id(): number {
    return this._id;
  }
  public set id(value: number) {
    this._id = value;
  }

  public get product(): { name: string; price: number; id: string } {
    return this._product;
  }
  public set product(value: { name: string; price: number; id: string }) {
    this._product = value;
  }
}
