import CreateOrderSagaState from './create-order.state';
import { OrderCreate } from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';
import { generateOrderId } from '../../helper/generate-order-id';
import OrderDomainEntity from '../../../domain/entity/order.domain-entity';
import PaymentInfoDomainEntity from '../../../domain/entity/payment-info.domain.entity';
import OrderMapper from '../../mapper/order.mapper';

export class CreateOrderStarted extends CreateOrderSagaState {
  public async create(dto: OrderCreate.Request): Promise<OrderDomainEntity> {
    const orderId = generateOrderId();
    const payment = new PaymentInfoDomainEntity();

    const order = new OrderDomainEntity(
      orderId,
      [],
      payment.id,
      dto.deliveryInfo.tableId
    );
    // some logic

    // Save to database
    await this.saga.sagaRepository.createSaga(orderId);
    return order;
  }
  public pay(orderId: string) {
    throw new Error('Cannot pay not created order');
  }
  public complete(orderId: string) {
    throw new Error('Cannot complete not created order');
  }
}

export class CreateOrderCreated extends CreateOrderSagaState {
  public create(dto: OrderCreate.Request): Promise<OrderDomainEntity> {
    throw new Error('Method not implemented.');
  }
  public async pay(orderId: string) {
    const repository = this.saga.orderRepository.repository;
    const order = await repository.find(orderId);
    console.log('Paying for order', JSON.stringify(order));
  }
  public complete(orderId: string) {
    throw new Error('Method not implemented.');
  }
}
