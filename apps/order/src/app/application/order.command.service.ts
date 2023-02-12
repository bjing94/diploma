import { Inject, Injectable } from '@nestjs/common';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import ProductAdapterService from './adapter/product.service';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedDto,
  OrderPayCommandResponse,
  OrderPayedEventPayload,
} from '@burger-shop/contracts';
import OrderItemDomainEntity from '../domain/entity/order-item.domain-entity';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import OrderAbstractRepository from './repository/order.abstract-repository';
import { OrderStatus } from '@burger-shop/interfaces';

@Injectable()
export default class OrderCommandService {
  constructor(
    private readonly productAdapterService: ProductAdapterService,
    private readonly kafkaProducerService: KafkaProducerService,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderAbstractRepository
  ) {}

  public async createOrder(
    dto: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    const { orderItems, paymentInfo } = dto;
    const orderDomainItems: OrderItemDomainEntity[] = [];
    console.log({ orderItems, paymentInfo });
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
    console.log('dto is ok', order.orderItems);
    const eventPayload: OrderCreatedDto = {
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
    };
    console.log('Created order:', order);
    console.log('Order event:', JSON.stringify(eventPayload));

    await this.kafkaProducerService.emitOrderCreated({ order: eventPayload });

    return null;
  }

  public async payOrder(orderId: string): Promise<OrderPayCommandResponse> {
    const order = await this.orderRepository.find(orderId);
    console.log('order', order);
    if (!order || order.status !== OrderStatus.CREATED) return null;

    const paymentId = order.paymentId;
    const paymentResponse = await this.kafkaProducerService.sendPaymentFulfill({
      id: paymentId,
      hash: '',
    });
    console.log('succes payment', paymentResponse);
    if (!paymentResponse.success) return null;
    const payload: OrderPayedEventPayload = {
      orderId: order.id,
    };
    await this.kafkaProducerService.emitOrderPayed(payload);
    return { orderId };
  }

  public async completeOrder(orderId: string) {
    const order = await this.orderRepository.find(orderId);
    if (!order || order.status !== OrderStatus.PAYED) return null;

    const payload: OrderPayedEventPayload = {
      orderId: order.id,
    };
    await this.kafkaProducerService.emitOrderCompleted(payload);
    return { orderId };
  }
}
