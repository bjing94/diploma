import CreateOrderSagaState from './create-order.state';
import { OrderCreate } from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';

export class CreateOrderStarted extends CreateOrderSagaState {
  public async create(dto: OrderCreate.Request) {
    console.log('Creating order');
    // Save to database
    await this.saga.sagaRepository.createSaga('25');
  }
  public pay(orderId: string) {
    throw new Error('Cannot pay not created order');
  }
  public complete(orderId: string) {
    throw new Error('Cannot complete not created order');
  }
}
