import {
  OrderCreatedEventPayload,
  OrderFindQueryRequest,
  OrderGetQueryRequest,
  OrderUpdatedEventPayload,
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

  @MessagePattern(QueryTopics.orderFind)
  async findOrders(@Payload() data: OrderFindQueryRequest) {
    return this.orderQueryService.findOrders(data);
  }

  @MessagePattern(EventTopics.orderUpdated)
  async onUpdated(@Payload() data: OrderUpdatedEventPayload) {
    await this.orderQueryService.onUpdated(data);
  }
}
