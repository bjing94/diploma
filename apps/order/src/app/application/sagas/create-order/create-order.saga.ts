import { OrderStatus } from '@burger-shop/interfaces';
import CreateOrderSagaRepository from '../../../infrastructure/database/mongo/repository/create-order-saga.repository';
import ProductAdapterService from '../../adapter/product.service';
import OrderRepositoryProvider from '../../providers/order.repository-provider';
import CreateOrderSagaState from './create-order.state';
import { CreateOrderCreated, CreateOrderStarted } from './create-order.steps';

export default class CreateOrderSaga {
  private state: CreateOrderSagaState;

  constructor(
    public sagaRepository: CreateOrderSagaRepository,
    public orderRepository: OrderRepositoryProvider,
    public productService: ProductAdapterService
  ) {}

  getState() {
    return this.state;
  }

  setState(status: OrderStatus) {
    switch (status) {
      case OrderStatus.CREATED:
        this.state = new CreateOrderStarted();
        this.state.setContext(this);
        break;
      case OrderStatus.WAITING_FOR_PAYMENT:
        this.state = new CreateOrderCreated();
        break;
      case OrderStatus.COMPLETED:
        break;
    }
    this.state.setContext(this);
  }
}
