import { OrderStatus } from '@burger-shop/interfaces';
import DeliveryInfoDomainEntity from './delivery-info.domain-entiy';
import ProductDomainEntity from './food.domain-entity';
import OrderItemDomainEntity from './order-item.domain-entity';
import PaymentInfoDomainEntity from './payment-info.domain.entity';

export default class OrderDomainEntity {
  private id: string;

  private status: OrderStatus;

  private orderItems: OrderItemDomainEntity[];

  private paymentInfo: PaymentInfoDomainEntity;

  private deliveryInfo: DeliveryInfoDomainEntity;

  private createdAt: Date;

  constructor(id: string, items: ProductDomainEntity[]) {
    this.id = id;
    this.orderItems = [];

    for (let i = 0; i < items.length; i++) {
      this.addItem(items[i]);
    }
  }

  public setDeliveryInfo(deliveryInfo: DeliveryInfoDomainEntity): void {
    this.deliveryInfo = deliveryInfo;
  }

  public getDeliveryInfo(): DeliveryInfoDomainEntity {
    return this.deliveryInfo;
  }

  public setPaymentInfo(paymentInfo: PaymentInfoDomainEntity): void {
    this.paymentInfo = paymentInfo;
  }

  public getPaymentInfo(): PaymentInfoDomainEntity {
    return this.paymentInfo;
  }

  public addItem(item: ProductDomainEntity): void {
    let maxLevel;
    if (this.orderItems.length === 0) {
      maxLevel = 0;
    } else {
      maxLevel = this.orderItems
        .sort((a, b) => a.getLevel() - b.getLevel())[0]
        .getLevel();
    }

    const newOrderItem = new OrderItemDomainEntity(maxLevel + 1, 1, item);
    this.orderItems.push(newOrderItem);
  }

  public removeItem(level: number): OrderItemDomainEntity | null {
    const newOrderItems = [];
    let currentLevel = 0;
    let removedItem = null;
    this.orderItems.forEach((orderItem) => {
      if (orderItem.getLevel() !== level) {
        orderItem.changeLevel(currentLevel);
        newOrderItems.push(orderItem);
        currentLevel++;
      } else {
        removedItem = orderItem;
      }
    });
    this.orderItems = newOrderItems;
    return removedItem;
  }

  public setStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setId(id: string): void {
    this.id = id;
  }
  public getId(): string {
    return this.id;
  }

  public setCreatedAt(date: Date): void {
    this.createdAt = date;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
