import { Inject, Injectable } from '@nestjs/common';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import ProductAdapterService from './adapter/product.service';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedDto,
  OrderCreatedEventPayload,
  OrderPayCommandResponse,
  OrderPayedEventPayload,
} from '@burger-shop/contracts';
import OrderItemDomainEntity from '../domain/entity/order-item.domain-entity';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import OrderAbstractRepository from './repository/order.abstract-repository';
import { OrderStatus } from '@burger-shop/interfaces';
import { RpcException } from '@nestjs/microservices';
import { EventStoreService } from '@burger-shop/event-store';

@Injectable()
export default class OrderCommandService {
  constructor(
    private readonly productAdapterService: ProductAdapterService,
    private readonly kafkaProducerService: KafkaProducerService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderAbstractRepository,
    private readonly eventStoreService: EventStoreService
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
        id: item.productId,
      });
      if (!response || !response.product) return null;
      const { price, id } = response.product;
      const { name } = response.product.product;
      orderDomainItems.push(
        new OrderItemDomainEntity({
          product: { name, price, id },
          quantity: item.count,
          id: idx,
        })
      );
      idx++;
      sum += item.count * price;
    }
    const response = await this.kafkaProducerService.sendPaymentCreate({
      sum,
      type: paymentInfo.type,
    });
    if (!response) return null;

    const order = new OrderDomainEntity({
      paymentId: response.id,
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
          };
        }),
        paymentId: order.paymentId,
      },
    };

    await this.kafkaProducerService.emitOrderCreated(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.orderCreated,
      payload: JSON.stringify(payload),
    });
    return { orderId: order.id };
  }

  public async payOrder(orderId: string): Promise<OrderPayCommandResponse> {
    const order = await this.orderRepository.find(orderId);
    if (!order || order.status !== OrderStatus.CREATED) return null;

    const paymentId = order.paymentId;
    const paymentResponse = await this.kafkaProducerService.sendPaymentFulfill({
      id: paymentId,
      hash: '',
    });
    if (!paymentResponse.success) return null;
    const payload: OrderPayedEventPayload = {
      orderId: order.id,
    };
    await this.kafkaProducerService.emitOrderPayed(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.orderPayed,
      payload: JSON.stringify(payload),
    });
    return { orderId };
  }

  public async completeOrder(orderId: string) {
    const order = await this.orderRepository.find(orderId);
    if (!order || order.status !== OrderStatus.PAYED) {
      throw new RpcException('Wrong order status');
    }

    const payload: OrderPayedEventPayload = {
      orderId: order.id,
    };
    await this.kafkaProducerService.emitOrderCompleted(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.orderCompleted,
      payload: JSON.stringify(payload),
    });
    return { orderId };
  }
}
