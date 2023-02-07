import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { Types } from 'mongoose';

export default class PaymentDomainEntity {
  private _id: string;
  private _link?: string;
  private _status: PaymentStatus;
  private _sum: number;
  private _type: PaymentType;

  constructor(
    sum: number,
    type: PaymentType,
    status?: PaymentStatus,
    id?: string,
    link?: string
  ) {
    this.status = status ?? PaymentStatus.PENDING;
    this.sum = sum;
    this.type = type;
    this.id = id ?? new Types.ObjectId(id).toString();
    this.link = '' ?? link;
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
}
