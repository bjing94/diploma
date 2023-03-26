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
    let sum = 0;
    for (const item of orderItems) {
      const response = await this.kafkaProducerService.sendMenuItemGet({
        id: item.menuItemId,
      });
      Logger.verbose(`Response ${JSON.stringify(response)}`);
      if (!response || !response.item) {
        Logger.error(`Menu item doesn't exist!`);
        return null;
      }
      const { price } = response.item;
      const { product } = response.item;
      orderDomainItems.push(
        new OrderItemDomainEntity({
          price,
          product: { id: product.id },
          quantity: item.count,
          id: idx,
        })
      );
      sum += price * item.count;
      idx++;
    }

    const order = new OrderDomainEntity({
      paymentId: '',
      items: orderDomainItems,
    });

    // Payment service
    const response = await this.kafkaProducerService.sendPaymentCreate({
      sum,
      type: paymentInfo.type,
      orderId: order.id,
    });
    if (!response) {
      Logger.error(`Payment not created!`);
      return null;
    }
    order.paymentId = response.id;

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
