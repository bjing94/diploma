import { Inject, Injectable } from '@nestjs/common';
import { OrderCreate, OrderCreated, OrderPayed } from '@burger-shop/contracts';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import { ClientProxy } from '@nestjs/microservices';
import { generateOrderId } from './helper/generate-order-id';
import ProductRepositoryProvider from './providers/product.repository-provider';
import OrderRepositoryProvider from './providers/order.repository-provider';
import ProductMapper from './mapper/product.mapper';
import CreateOrderSagaRepository from '../infrastructure/database/mongo/repository/create-order-saga.repository';
import CreateOrderSaga from './sagas/create-order/create-order.saga';
import { OrderStatus } from '@burger-shop/interfaces';
import CreateOrderSagaRepositoryProvider from './providers/order.create-order-saga.repository-provider';

const orderData = {};

@Injectable()
export default class OrderCommandService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientProxy,
    // private readonly productRepoProvider: ProductRepositoryProvider,
    private readonly orderRepoProvider: OrderRepositoryProvider,
    private readonly createOrderSagaRepo: CreateOrderSagaRepositoryProvider
  ) {}

  // public async create(dto: OrderCreate.Request): Promise<OrderCreate.Response> {
  //   console.log('Creating order', dto);
  //   const { orderItems } = dto;
  //   const id = generateOrderId();
  //   // Get products
  //   const products = await this.productRepoProvider.repository
  //     .findMany(dto.orderItems.map((item) => item.foodId))
  //     .then((products) => {
  //       return ProductMapper.toDomainEntityMany(products);
  //     });

  //   const productsMap = {};
  //   for (let i = 0; i < products.length; i++) {
  //     productsMap[products[i].id] = products[i];
  //   }
  //   for (let i = 0; i < orderItems.length; i++) {
  //     productsMap[orderItems[i].foodId] = {
  //       ...productsMap[orderItems[i].foodId],
  //       count: orderItems[i].count,
  //     };
  //   }

  //   this.kafka.send('delivery.create-order.saga', { status: 'created' });

  //   // 1. OK Send to payment service
  //   // payment.create-order.saga
  //   // 2. NOT OK reject order
  //   //
  //   const resProducts = [];
  //   for (const product of Object.values(productsMap)) {
  //     resProducts.push(product);
  //   }
  //   const obj = new OrderDomainEntity(
  //     generateOrderId(),
  //     resProducts,
  //     dto.paymentInfo,
  //     dto.deliveryInfo
  //   );
  //   orderData[id] = obj;

  //   // Dispatch event to topic order.created.event
  //   this.kafka.emit<void, OrderCreated.Payload>(OrderCreated.topic, {
  //     id: obj.getId(),
  //     status: obj.getStatus(),
  //     orderItems: obj.getOrderItems().map((item) => {
  //       return {
  //         count: item.getCount(),
  //         foodId: item.getProduct().id,
  //       };
  //     }),
  //     createdAt: new Date(),
  //   });
  //   return {
  //     orderId: obj.getId(),
  //   };
  // }

  public async createOrder(dto: OrderCreate.Request) {
    const saga = new CreateOrderSaga(
      this.createOrderSagaRepo.repository,
      this.orderRepoProvider
    );
    saga.setState(OrderStatus.CREATED);
    const result = await saga.getState().create(dto);
    await this.kafka.emit<void, OrderCreated.Payload>(OrderCreated.topic, {
      ...dto,
      id: result.getId(),
    });
    return result;
  }

  // public async cancelOrder() {}

  public async payOrder(orderId: string) {
    const sagaInfo = await (
      await this.createOrderSagaRepo.repository.getSaga(orderId)
    ).toObject();
    if (!sagaInfo) return null;
    const saga = new CreateOrderSaga(
      this.createOrderSagaRepo.repository,
      this.orderRepoProvider
    );
    saga.setState(sagaInfo.status);
    const result = saga.getState().pay(orderId);
    await this.kafka.emit<void, OrderPayed.Payload>(OrderPayed.topic, {
      orderId,
    });
    return result;
  }

  // public async completeOrder() {}
}
