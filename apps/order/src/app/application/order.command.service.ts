import { Injectable, Logger } from '@nestjs/common';
import ProductAdapterService from './adapter/product.service';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedEventPayload,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
  OrderUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStoreOrderService } from '@burger-shop/event-store';
import {
  OrderItemDomainEntity,
  OrderDomainEntity,
} from '@burger-shop/domain-entity';

@Injectable()
export default class OrderCommandService {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly eventStoreService: EventStoreOrderService
  ) {}

  public async createOrder(
    dto: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    const { orderItems, paymentInfo } = dto;
    const orderDomainItems: OrderItemDomainEntity[] = [];
    let idx = 0;
    for (const item of orderItems) {
      const response = await this.kafkaProducerService.sendMenuItemGet({
        id: item.productId,
      });
      Logger.verbose(`Response ${JSON.stringify(response)}`);
      if (!response || !response.item) return null;
      const { price, id } = response.item;
      const { name } = response.item.product;
      orderDomainItems.push(
        new OrderItemDomainEntity({
          price,
          product: { id },
          quantity: item.count,
          id: idx,
        })
      );
      idx++;
    }
    // Payment service
    // const response = await this.kafkaProducerService.sendPaymentCreate({
    //   sum,
    //   type: paymentInfo.type,
    // });
    // if (!response) return null;

    const order = new OrderDomainEntity({
      paymentId: 'response.id',
      items: orderDomainItems,
    });
    const payload: OrderCreatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
        orderItems: order.orderItems.map((item) => {
          return {
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
          };
        }),
        paymentId: order.paymentId,
      },
    };

    await this.kafkaProducerService.emitOrderCreated(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.orderCreated,
      payload: JSON.stringify(payload),
      objectId: order.id,
    });
    return { orderId: order.id };
  }

  public async updateOrder(
    dto: OrderUpdateCommandRequest
  ): Promise<OrderUpdateCommandResponse> {
    const { id } = dto;
    const order = await this.eventStoreService.getOrder(id);
    if (!order) return null;

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
}
