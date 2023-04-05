import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import OrderCommandService from './order.command.service';
import LoggerInterceptor from './interceptors/logger.interceptor';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
  OrderUpdatedEventPayload,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CommandTopics, EventTopics } from '@burger-shop/kafka-module';

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

  @MessagePattern(CommandTopics.orderUpdate)
  updated(
    @Payload() dto: OrderUpdateCommandRequest
  ): Promise<OrderUpdateCommandResponse> {
    return this.service.updateOrder(dto);
  }

  @MessagePattern(EventTopics.paymentStatusUpdated)
  async onPaymentUpdated(@Payload() data: PaymentStatusUpdatedEventPayload) {
    await this.service.onPaymentStatusUpdated(data);
  }

  @MessagePattern(CommandTopics.orderRunEvents)
  async runOrderEvents() {
    await this.service.runOrderEvents();
  }
}
