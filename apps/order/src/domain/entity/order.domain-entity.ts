import { OrderStatus } from '@burger-shop/interfaces';
import DeliveryInfoDomainEntity from './delivery-info.domain-entiy';
import ProductDomainEntity from './food.domain-entity';
import OrderItemDomainEntity from './order-item.domain-entity';
import PaymentInfoDomainEntity from './payment-info.domain.entity';

export default class OrderDomainEntity {
  private id: number;

  private status: OrderStatus;

  private orderItems: OrderItemDomainEntity[];

  private paymentInfo: PaymentInfoDomainEntity;

  private deliveryInfo: DeliveryInfoDomainEntity;

  private createdAt: Date;

  constructor(obj?: {
    id?: number;
    status?: OrderStatus;
    orderItems?: OrderItemDomainEntity[];
    paymentInfo?: PaymentInfoDomainEntity;
    deliveryInfo?: DeliveryInfoDomainEntity;
    createdAt?: Date;
  }) {
    if (obj) Object.assign(this, obj);
  }

  public static create(lastId: number, orderItems: OrderItemDomainEntity[]) {
    return new OrderDomainEntity({ id: lastId + 1, orderItems });
  }

  public addItem(item: ProductDomainEntity): void {
    const maxLevel = this.orderItems.sort(
      (a, b) => a.getLevel() - b.getLevel()
    );
    const newOrderItem = new OrderItemDomainEntity();
    this.orderItems.push(newOrderItem);
  }

  public setStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setId(id: number): void {
    this.id = id;
  }
  public getId(id: number): number {
    return id;
  }
}
