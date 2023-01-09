import { OrderStatus } from '@burger-shop/interfaces';
import CreateOrderSagaRepository from '../../../infrastructure/database/mongo/repository/create-order-saga.repository';
import CreateOrderSagaState from './create-order.state';
import { CreateOrderStarted } from './create-order.steps';

export default class CreateOrderSaga {
  private state: CreateOrderSagaState;

  constructor(public sagaRepository: CreateOrderSagaRepository) {}

  getState() {
    return this.state;
  }

  setState(status: OrderStatus) {
    switch (status) {
      case OrderStatus.CREATED:
        this.state = new CreateOrderStarted();
        this.state.setContext(this);
        break;
      case OrderStatus.PAYED:
        break;
      case OrderStatus.COMPLETED:
        break;
    }
  }
}
