import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export default class OrderCommandService {
  constructor(
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

    order.status = dto.status;

    const payload: OrderUpdatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
      },
    };

    await this.eventStoreService.saveEvent({
      objectId: id,
      payload: JSON.stringify(payload),
      name: EventTopics.orderUpdated,
    });

    await this.kafkaProducerService.emitOrderUpdated({
      order: {
        id,
        status: order.status,
      },
    });

    return {
      id: id,
      status: order.status,
    };
  }

  public async onPaymentStatusUpdated(data: PaymentStatusUpdatedEventPayload) {
    const order = await this.eventStoreService.getOrder(data.orderId);
    if (!order) return;

    if (data.status === PaymentStatus.FULFILLED) {
      console.log('order payed');
      await this.kafkaProducerService.emitOrderUpdated({
        order: {
          id: data.orderId,
          status: OrderStatus.PAYED,
        },
      });
    }
  }
}
