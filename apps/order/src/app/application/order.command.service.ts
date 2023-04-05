import { Inject, Injectable, Logger } from '@nestjs/common';
import ProductAdapterService from './adapter/product.service';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedEventPayload,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
  OrderUpdatedEventPayload,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStoreOrderService } from '@burger-shop/event-store';
import {
  OrderItemDomainEntity,
  OrderDomainEntity,
} from '@burger-shop/domain-entity';
import { OrderStatus, PaymentStatus } from '@burger-shop/interfaces';
import CreateOrderSaga from './saga/order.saga';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Injectable()
export default class OrderCommandService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderAbstractRepository,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly eventStoreService: EventStoreOrderService
  ) {}

  public async createOrder(
    dto: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    const saga = new CreateOrderSaga(
      this.kafkaProducerService,
      this.eventStoreService
    );
    saga.setState(OrderStatus.NEW);
    const result = await saga.getState().create(dto);
    return result;
  }

  public async updateOrder(
    dto: OrderUpdateCommandRequest
  ): Promise<OrderUpdateCommandResponse> {
    const { id } = dto;
    const order = await this.eventStoreService.getOrder(id);
    if (!order) return null;

    const saga = new CreateOrderSaga(
      this.kafkaProducerService,
      this.eventStoreService
    );
    saga.setState(order.status);
    if (dto.status === OrderStatus.WAITING_FOR_PICKUP) {
      return saga.getState().ready(dto);
    }
    if (dto.status === OrderStatus.COMPLETED) {
      return saga.getState().complete(dto);
    }

    return null;
  }

  public async onPaymentStatusUpdated(data: PaymentStatusUpdatedEventPayload) {
    const order = await this.eventStoreService.getOrder(data.orderId);
    if (!order || order.status !== OrderStatus.CREATED) return;
    const saga = new CreateOrderSaga(
      this.kafkaProducerService,
      this.eventStoreService
    );
    saga.setState(order.status);

    if (data.status === PaymentStatus.FULFILLED) {
      return saga.getState().pay(data);
    }
    if (data.status === PaymentStatus.REJECTED) {
      return saga.getState().cancel(data.orderId);
    }
  }

  async runOrderEvents() {
    try {
      await this.orderRepository.clearAll();
      const events = await this.eventStoreService.getEvents({});
      console.log(`Events:`, events.length);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        await this.kafkaProducerService.emit(event.name, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
