import { ProductDomainEntity } from '../product/product.domain-entity';
import {
  DeliveryStatus,
  OrderStatus,
  PaymentStatus,
  PaymentType,
} from '@burger-shop/interfaces';
import DeliveryInfoDomainEntity from './delivery-info.domain-entiy';
import OrderItemDomainEntity from './order-item.domain-entity';
import PaymentInfoDomainEntity from './payment-info.domain.entity';

export default class OrderDomainEntity {
  private id: string;

  private status: OrderStatus = OrderStatus.CREATED;

  private orderItems: OrderItemDomainEntity[];

  private paymentId: string;

  private deliveryId?: string;

  private createdAt: Date;

  constructor(
    id: string,
    items: {
      product: ProductDomainEntity;
      count: number;
    }[],
    paymentId: string,
    deliveryId?: string
  ) {
    this.id = id;
    this.orderItems = [];
    let totalPrice = 0;
    for (let i = 0; i < items.length; i++) {
      totalPrice += items[i].product.price * items[i].count;
      this.addItem(items[i].product);
    }

    this.paymentId = paymentId;

    this.deliveryId = deliveryId;
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
    const newOrderItems: OrderItemDomainEntity[] = [];
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

  public getOrderItems(): OrderItemDomainEntity[] {
    return this.orderItems;
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
