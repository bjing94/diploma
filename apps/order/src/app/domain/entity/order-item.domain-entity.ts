import { MIN_ORDER_ITEM_LEVEL } from '../const/order.const';
import ProductDomainEntity from './food.domain-entity';

export default class OrderItemDomainEntity {
  private level: number;
  private count: number;
  private product: ProductDomainEntity;

  constructor(level: number, count: number, product: ProductDomainEntity) {
    this.level = level;
    this.count = count;
    this.product = product;
  }

  get totalPrice(): number {
    return this.product.price * this.count;
  }

  public getLevel(): number {
    return this.level;
  }

  public changeLevel(newLevel: number): void {
    if (newLevel >= MIN_ORDER_ITEM_LEVEL) {
      this.level = newLevel;
    }
  }
}
