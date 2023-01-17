import CreateOrderSagaState from './create-order.state';
import { OrderCreate } from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';
import { generateOrderId } from '../../helper/generate-order-id';
import OrderDomainEntity from '../../../domain/entity/order.domain-entity';
import PaymentInfoDomainEntity from '../../../domain/entity/payment-info.domain.entity';
import OrderMapper from '../../mapper/order.mapper';

export class CreateOrderStarted extends CreateOrderSagaState {
  public async create(dto: OrderCreate.Request) {
    const orderId = generateOrderId();
    const payment = new PaymentInfoDomainEntity();

    const order = new OrderDomainEntity(
      orderId,
      [],
      payment.id,
      dto.deliveryInfo.tableId
    );
    // some logic

    console.log('Creating order', JSON.stringify(order));
    // Save to database
    const dbOrder = OrderMapper.toDatabase(order);
    await this.saga.orderRepository.repository.create(dbOrder);
    await this.saga.sagaRepository.createSaga(orderId);
    return dbOrder.id;
  }
  public pay(orderId: string) {
    throw new Error('Cannot pay not created order');
  }
  public complete(orderId: string) {
    throw new Error('Cannot complete not created order');
  }
}

export class CreateOrderCreated extends CreateOrderSagaState {
  public create(dto: OrderCreate.Request) {
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
