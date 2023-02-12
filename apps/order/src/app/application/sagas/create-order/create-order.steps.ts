// import CreateOrderSagaState from './create-order.state';
// import { generateOrderId } from '../../helper/generate-order-id';
// import OrderDomainEntity from '../../../domain/entity/order.domain-entity';
// import PaymentInfoDomainEntity from '../../../domain/entity/payment-info.domain.entity';
// import { ProductDomainEntity } from '@burger-shop/domain-entities';
// import OrderMapper from '../../mapper/order.mapper';
// import { OrderStatus } from '@burger-shop/interfaces';
// import { OrderCreateCommandRequest } from '@burger-shop/contracts';
// import { Types } from 'mongoose';

// export class CreateOrderStarted extends CreateOrderSagaState {
//   public async create(
//     dto: OrderCreateCommandRequest
//   ): Promise<OrderDomainEntity | null> {
//     const orderId = new Types.ObjectId().toString();
//     const payment = new PaymentInfoDomainEntity();
//     const products: ProductDomainEntity[] = [];
//     for (const orderItem of dto.orderItems) {
//       const response = await this.saga.productService.getProduct(
//         orderItem.productId
//       );
//       if (!response.product) return null;
//       const { id, price, name } = response.product;
//       products.push(new ProductDomainEntity(name, price, id));
//     }

//     const order = new OrderDomainEntity(
//       orderId,
//       products.map((product) => ({ product, count: 1 })),
//       payment.id
//       // dto.deliveryInfo.tableId
//     );

//     await this.saga.sagaRepository.createSaga(orderId);
//     return order;
//   }
//   public async pay(orderId: string) {
//     return false;
//   }
//   public async complete(orderId: string) {
//     return false;
//   }
// }

// export class CreateOrderCreated extends CreateOrderSagaState {
//   public create(dto: OrderCreateCommandRequest): Promise<OrderDomainEntity> {
//     return null;
//   }
//   public async pay(orderId: string): Promise<boolean> {
//     const repository = this.saga.orderRepository.repository;
//     const order = await repository.find(orderId);
//     if (!order) return false;
//     return true;
//   }
//   public async complete(orderId: string) {
//     return false;
//   }
// }

// export class CreateOrderPayed extends CreateOrderSagaState {
//   public async create(
//     dto: OrderCreateCommandRequest
//   ): Promise<OrderDomainEntity> {
//     return null;
//   }
//   public async pay(orderId: string): Promise<boolean> {
//     return false;
//   }
//   public async complete(orderId: string) {
//     const repository = this.saga.orderRepository.repository;
//     const order = await repository.find(orderId);
//     if (!order) return false;

//     const products: any[] = [];
//     for (const orderItem of order.orderItems) {
//       const response = await this.saga.productService.getProduct(
//         orderItem.productId
//       );
//       if (!response.product) return null;
//       const { id, price, name } = response.product;
//       products.push({
//         product: new ProductDomainEntity(name, price, id),
//         count: 1,
//       });
//     }
//     const orderDomainEntity = OrderMapper.toDomain(order, products);
//     orderDomainEntity.status = OrderStatus.COMPLETED;

//     return true;
//   }
// }
