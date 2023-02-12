import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
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
    const result = this.kafkaProducerService.send<
      OrderGetQueryResponse,
      OrderGetQueryRequest
    >(QueryTopics.orderGet, { id });

    if (!result) {
      throw new BadRequestException('Order not found!');
    }
    return result;
  }

  public async pay(id: string) {
    return this.kafkaProducerService.sendOrderPay({ orderId: id });
  }

  public async complete(id: string) {
    return this.kafkaProducerService.sendOrderComplete({ orderId: id });
  }
}
