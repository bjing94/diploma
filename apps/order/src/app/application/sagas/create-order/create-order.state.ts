import CreateOrderSaga from './create-order.saga';
import { OrderCreate } from '@burger-shop/contracts';
import OrderDomainEntity from '../../../domain/entity/order.domain-entity';

export default abstract class CreateOrderSagaState {
  protected saga: CreateOrderSaga;

  public setContext(saga: CreateOrderSaga) {
    this.saga = saga;
  }

  public abstract create(dto: OrderCreate.Request): Promise<OrderDomainEntity>;

  //   public abstract cancel();

  public abstract pay(orderId: string);

  //   public abstract deliver();

  public abstract complete(orderId: string);
}
// created -> waiting for payment -> waiting for pickup/waiting for delivery guy -> in delivery -> completed
