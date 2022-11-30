import OrderDomainEntity from '../../domain/order.domain-entity';

export default abstract class OrderAbstractRepository {
  public abstract find(id: string): Promise<OrderDomainEntity>;
  public abstract create(order: OrderDomainEntity): Promise<OrderDomainEntity>;
  public abstract update(
    id: string,
    order: OrderDomainEntity
  ): Promise<OrderDomainEntity>;
  public abstract delete(id: string): Promise<void>;
}
