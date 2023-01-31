import {
  OrderComplete,
  OrderCreate,
  OrderGetOrder,
  OrderPay,
} from '@burger-shop/contracts';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { kafkaConfig } from '../../config/provide-kafka-config';

@Injectable()
export default class OrderService {
  constructor(
    @Inject(kafkaConfig.clientName) private readonly kafkaClient: ClientKafka
  ) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(OrderCreate.topic);
    this.kafkaClient.subscribeToResponseOf(OrderGetOrder.topic);
    this.kafkaClient.subscribeToResponseOf(OrderPay.topic);
  }

  public async create(dto: OrderCreate.Request) {
    const result = await lastValueFrom(
      this.kafkaClient.send<OrderCreate.Response, OrderCreate.Request>(
        OrderCreate.topic,
        dto
      )
    );
    if (!result) {
      throw new BadRequestException('Order not created!');
    }
    return result;
  }

  public async get(id: string) {
    throw new BadRequestException('Order not found!');
    const result = await lastValueFrom(
      this.kafkaClient.send<OrderGetOrder.Response, OrderGetOrder.Request>(
        OrderGetOrder.topic,
        { id }
      )
    );
    if (!result) {
      throw new BadRequestException('Order not found!');
    }
    return result;
  }

  public async pay(id: string) {
    return lastValueFrom(
      this.kafkaClient.send<OrderPay.Response, OrderPay.Request>(
        OrderPay.topic,
        { orderId: id }
      )
    );
  }

  public async complete(id: string) {
    const response = await lastValueFrom(
      this.kafkaClient.send<OrderComplete.Response, OrderComplete.Request>(
        OrderPay.topic,
        { orderId: id }
      )
    );
    return response;
  }
}
