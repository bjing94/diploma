import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import OrderCommandService from './order.command.service';
import LoggerInterceptor from './interceptors/logger.interceptor';
import {
  OrderCompleteCommandRequest,
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderPayCommandRequest,
} from '@burger-shop/contracts';
import { CommandTopics } from '@burger-shop/kafka-module';

@UseInterceptors(LoggerInterceptor)
@Controller()
export default class OrderCommandController {
  constructor(private readonly service: OrderCommandService) {}

  @MessagePattern(CommandTopics.orderCreate)
  create(
    @Payload() dto: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    return this.service.createOrder(dto);
  }

  @MessagePattern(CommandTopics.orderPay)
  pay(@Payload() dto: OrderPayCommandRequest): Promise<any> {
    return this.service.payOrder(dto.orderId);
  }

  @MessagePattern(CommandTopics.orderComplete)
  complete(@Payload() dto: OrderCompleteCommandRequest): Promise<any> {
    return this.service.completeOrder(dto.orderId);
  }
}
