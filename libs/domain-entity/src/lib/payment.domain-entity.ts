import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { Types } from 'mongoose';

export class PaymentDomainEntity {
  private _id: string;
  private _orderId: string;
  private _link?: string;
  private _status: PaymentStatus;
  private _sum: number;
  private _type: PaymentType;

  constructor(data: {
    sum: number;
    type: PaymentType;
    orderId: string;
    status?: PaymentStatus;
    id?: string;
    link?: string;
  }) {
    this.status = data.status ?? PaymentStatus.PENDING;
    this.sum = data.sum;
    this.type = data.type;
    this.id = data.id ?? new Types.ObjectId(data.id).toString();
    this.link = '' ?? data.link;
  }

  public createSberPaymentLink() {
    if (this.type !== PaymentType.CARD) return null;
    const link = 'localhost:3000/pay/' + this.id;
    this.link = link;
    return link;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get status(): PaymentStatus {
    return this._status;
  }
  public set status(value: PaymentStatus) {
    this._status = value;
  }
  public get type(): PaymentType {
    return this._type;
  }
  public set type(value: PaymentType) {
    this._type = value;
  }

  public get link(): string {
    return this._link;
  }
  public set link(value: string) {
    this._link = value;
  }

  public get sum(): number {
    return this._sum;
  }
  public set sum(value: number) {
    this._sum = value;
  }

  public get orderId(): string {
    return this._orderId;
  }
  public set orderId(value: string) {
    this._orderId = value;
  }
}
