import { Inject, Injectable } from '@nestjs/common';
import {
  OrderCompleted,
  OrderCreate,
  OrderCreated,
  OrderPayed,
} from '@burger-shop/contracts';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import { ClientProxy } from '@nestjs/microservices';
import { generateOrderId } from './helper/generate-order-id';
import OrderRepositoryProvider from './providers/order.repository-provider';
import CreateOrderSagaRepository from '../infrastructure/database/mongo/repository/create-order-saga.repository';
import CreateOrderSaga from './sagas/create-order/create-order.saga';
import { OrderStatus } from '@burger-shop/interfaces';
import CreateOrderSagaRepositoryProvider from './providers/order.create-order-saga.repository-provider';
import ProductAdapterService from './adapter/product.service';

@Injectable()
export default class OrderCommandService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientProxy,
    // private readonly productRepoProvider: ProductRepositoryProvider,
    private readonly orderRepoProvider: OrderRepositoryProvider,
    private readonly createOrderSagaRepo: CreateOrderSagaRepositoryProvider,
    private readonly productAdapterService: ProductAdapterService
  ) {}

  public async createOrder(dto: OrderCreate.Request) {
    const saga = new CreateOrderSaga(
      this.createOrderSagaRepo.repository,
      this.orderRepoProvider,
      this.productAdapterService
    );
    saga.setState(OrderStatus.CREATED);
    const result = await saga.getState().create(dto);
    if (!result) return result;

    await this.kafka.emit<void, OrderCreated.Payload>(OrderCreated.topic, {
      order: result,
    });
    return result;
  }

  public async payOrder(orderId: string) {
    const sagaInfo = await (
      await this.createOrderSagaRepo.repository.getSaga(orderId)
    ).toObject();
    if (!sagaInfo) return null;
    const saga = new CreateOrderSaga(
      this.createOrderSagaRepo.repository,
      this.orderRepoProvider,
      this.productAdapterService
    );
    saga.setState(sagaInfo.status);
    const result = saga.getState().pay(orderId);
    if (!result) return result;

    await this.kafka.emit<void, OrderPayed.Payload>(OrderPayed.topic, {
      orderId,
    });
    return result;
  }

  public async completeOrder(orderId: string) {
    const sagaInfo = await this.createOrderSagaRepo.repository.getSaga(orderId);
    if (!sagaInfo) return null;
    const saga = new CreateOrderSaga(
      this.createOrderSagaRepo.repository,
      this.orderRepoProvider,
      this.productAdapterService
    );
    saga.setState(sagaInfo.status);
    const result = saga.getState().complete(orderId);
    if (!result) return result;

    await this.kafka.emit<void, OrderCompleted.Payload>(OrderCompleted.topic, {
      orderId,
    });
    return result;
  }
}
