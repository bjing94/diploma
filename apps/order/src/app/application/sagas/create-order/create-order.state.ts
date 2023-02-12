// import CreateOrderSaga from './create-order.saga';
// import { OrderCreateCommandRequest } from '@burger-shop/contracts';
// import OrderDomainEntity from '../../../domain/entity/order.domain-entity';

// export default abstract class CreateOrderSagaState {
//   protected saga: CreateOrderSaga;

//   public setContext(saga: CreateOrderSaga) {
//     this.saga = saga;
//   }

//   public abstract create(
//     dto: OrderCreateCommandRequest
//   ): Promise<OrderDomainEntity | null>;

//   //   public abstract cancel();

//   public abstract pay(orderId: string): Promise<boolean>;

//   //   public abstract deliver();

//   public abstract complete(orderId: string): Promise<boolean>;
// }
// // created -> waiting for payment -> waiting for pickup/waiting for delivery guy -> in delivery -> completed
