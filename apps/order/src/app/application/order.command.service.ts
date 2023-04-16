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
import {
  EventStoreOrderService,
  PaymentEventNames,
} from '@burger-shop/event-store';
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

    if (data.eventName === PaymentEventNames.paymentFulfilled) {
      return saga.getState().pay(data);
    }
    if (data.eventName === PaymentEventNames.paymentRejected) {
      return saga.getState().cancel(data.orderId);
    }
  }

  public async orderClearRead() {
    await this.orderRepository.clearAll();
  }
}
