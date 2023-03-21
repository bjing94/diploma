import { Types } from 'mongoose';

export class CookingStockDomainEntity {
  private _id: string;

  private _productId: string;

  private _quantity: number;

  constructor(data: { productId: string; quantity: number; id?: string }) {
    this.id = data.id ?? new Types.ObjectId(data.id).toString();
    this.productId = data.productId;
    this.quantity = data.quantity;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get productId(): string {
    return this._productId;
  }
  public set productId(value: string) {
    this._productId = value;
  }

  public get quantity(): number {
    return this._quantity;
  }
  public set quantity(value: number) {
    this._quantity = value;
  }
}
