import { OrderCreate } from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { kafkaConfig } from '../../config/provide-kafka-config';

@Injectable()
export default class OrderService {
  constructor(
    @Inject(kafkaConfig.clientName) private readonly kafkaClient: ClientProxy
  ) {}

  public async create(dto: OrderCreate.Request) {
    await this.kafkaClient.emit(OrderCreate.topic, dto);
  }
}
