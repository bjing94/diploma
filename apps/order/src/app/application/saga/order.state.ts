import {
  OrderCreateCommandRequest,
  OrderUpdateCommandRequest,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import CreateOrderSaga from './order.saga';

export default abstract class CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public setContext(saga: CreateOrderSaga) {
    this.saga = saga;
  }

  public abstract create(dto: OrderCreateCommandRequest); // Занимаем инвентарь
  public abstract pay(data: PaymentStatusUpdatedEventPayload);
  public abstract cancel(); // Возвращаем инветарь
  public abstract ready(dto: OrderUpdateCommandRequest);
  public abstract complete(dto: OrderUpdateCommandRequest);
}
