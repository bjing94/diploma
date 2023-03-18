export class OrderItemDomainEntity {
  private _id: number;
  private _quantity: number;
  private _product: { id: string };
  private _price: number;

  constructor(data: {
    quantity: number;
    product: { id: string };
    price: number;
    id?: number;
  }) {
    this.quantity = data.quantity;
    this.product = data.product;
    this.id = data.id;
    this.price = data.price;
  }

  get totalPrice(): number {
    return this.price * this.quantity;
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

  public get product(): { id: string } {
    return this._product;
  }
  public set product(value: { id: string }) {
    this._product = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
  }
}
