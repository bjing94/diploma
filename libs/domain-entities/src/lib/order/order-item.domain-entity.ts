import { ProductDomainEntity } from '../product/product.domain-entity';
import { MIN_ORDER_ITEM_LEVEL } from './order.const';

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

  public getProduct() {
    return this.product;
  }

  public getCount() {
    return this.count;
  }
}
