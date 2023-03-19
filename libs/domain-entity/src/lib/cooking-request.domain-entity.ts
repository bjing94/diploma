import { CookingRequestStatus } from '@burger-shop/interfaces';
import { Types } from 'mongoose';

export class CookingRequestDomainEntity {
  private _id: string;

  private _productId: string;

  private _status: CookingRequestStatus;

  constructor(data: {
    productId: string;
    status: CookingRequestStatus;
    id?: string;
  }) {
    this.id = data.id ?? new Types.ObjectId(data.id).toString();
    this.productId = data.productId;
    this.status = data.status;
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

  public get status(): CookingRequestStatus {
    return this._status;
  }
  public set status(value: CookingRequestStatus) {
    this._status = value;
  }
}
