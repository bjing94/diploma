import { generateId } from './generate-order-id';

export class ProductDomainEntity {
  private _id: string;

  private _name: string;

  private _price: number;

  constructor(name: string, price: number, id?: string) {
    this.id = id ?? generateId();
    this.name = name;
    this.price = price;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}
