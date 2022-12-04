import { OrderCreate, OrderGetOrder } from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
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
  }

  public async create(dto: OrderCreate.Request) {
    return lastValueFrom(
      this.kafkaClient.send<OrderCreate.Response, OrderCreate.Request>(
        OrderCreate.topic,
        dto
      )
    );
  }

  public async get(id: string) {
    return lastValueFrom(
      this.kafkaClient.send<OrderGetOrder.Response, OrderGetOrder.Request>(
        OrderGetOrder.topic,
        { id }
      )
    );
  }
}
