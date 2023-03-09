import {
  OrderCreatedEventPayload,
  OrderGetQueryRequest,
} from '@burger-shop/contracts';
import { EventTopics, QueryTopics } from '@burger-shop/kafka-module';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import LoggerInterceptor from './interceptors/logger.interceptor';
import OrderQueryService from './order.query.service';

@UseInterceptors(LoggerInterceptor)
@Controller()
export default class OrderQueryController {
  constructor(private readonly orderQueryService: OrderQueryService) {}

  @MessagePattern(EventTopics.orderCreated)
  async onCreated(@Payload() data: OrderCreatedEventPayload) {
    await this.orderQueryService.onCreated(data);
  }

  @MessagePattern(QueryTopics.orderGet)
  async getOrder(@Payload() data: OrderGetQueryRequest) {
    return this.orderQueryService.getOrder(data);
  }

  // @MessagePattern(EventTopics.orderPayed)
  // async onPayed(@Payload() data: OrderPayedEventPayload) {
  //   await this.orderQueryService.onPayed(data);
  // }

  // @MessagePattern(EventTopics.orderCompleted)
  // async onCompleted(@Payload() data: OrderCompletedEventPayload) {
  //   await this.orderQueryService.onCompleted(data);
  // }
}
