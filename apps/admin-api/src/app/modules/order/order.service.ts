import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderFindQueryRequest,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdateCommandRequest,
} from '@burger-shop/contracts';
import {
  CommandTopics,
  KafkaProducerService,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export default class OrderService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  public async create(dto: OrderCreateCommandRequest) {
    const result = await this.kafkaProducerService.send<
      OrderCreateCommandResponse,
      OrderCreateCommandRequest
    >(CommandTopics.orderCreate, dto);

    if (!result) {
      throw new BadRequestException('Order not created!');
    }
    return result;
  }

  public async get(id: string) {
    const result = await this.kafkaProducerService.sendOrderGet({ id });

    if (!result) {
      throw new BadRequestException('Order not found!');
    }
    return result;
  }

  public async update(dto: OrderUpdateCommandRequest) {
    const result = await this.kafkaProducerService.sendOrderUpdate(dto);

    if (!result) {
      throw new BadRequestException('Order not updated!');
    }
    return result;
  }

  public async find(data: OrderFindQueryRequest) {
    const result = await this.kafkaProducerService.sendOrderFind(data);

    return { orders: result.orders ?? [] };
  }
}
