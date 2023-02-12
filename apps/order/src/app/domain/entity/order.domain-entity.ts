import { OrderStatus } from '@burger-shop/interfaces';
import { generateObjectId } from '@burger-shop/helpers';
import OrderItemDomainEntity from './order-item.domain-entity';

export default class OrderDomainEntity {
  private _id: string;

  private _status: OrderStatus = OrderStatus.CREATED;

  private _orderItems: OrderItemDomainEntity[];

  private _paymentId: string;

  private _deliveryId?: string;

  private _createdAt: Date;

  constructor(data: {
    id?: string;
    items: OrderItemDomainEntity[];
    paymentId: string;
    deliveryId?: string;
  }) {
    this.id = data.id ?? generateObjectId();
    this._orderItems = data.items;

    this.paymentId = data.paymentId;

    this.deliveryId = data.deliveryId;
  }

  public get orderItems(): OrderItemDomainEntity[] {
    return this._orderItems;
  }

  public set status(newStatus: OrderStatus) {
    this._status = newStatus;
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public set id(id: string) {
    this._id = id;
  }
  public get id(): string {
    return this._id;
  }

  public set createdAt(date: Date) {
    this._createdAt = date;
  }
  public get createdAt(): Date {
    return this._createdAt;
  }

  public set paymentId(id: string) {
    this._paymentId = id;
  }
  public get paymentId(): string {
    return this._paymentId;
  }

  public get deliveryId(): string {
    return this._deliveryId;
  }
  public set deliveryId(value: string) {
    this._deliveryId = value;
  }
}
