import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import OrderCommandService from './order.command.service';
import LoggerInterceptor from './interceptors/logger.interceptor';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CommandTopics, EventTopics } from '@burger-shop/kafka-module';

@UseInterceptors(LoggerInterceptor)
@Controller()
export default class OrderCommandController {
  constructor(private readonly orderCommandService: OrderCommandService) {}

  @MessagePattern(CommandTopics.orderCreate)
  create(
    @Payload() payload: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    return this.orderCommandService.createOrder(payload);
  }

  @MessagePattern(CommandTopics.orderUpdate)
  update(
    @Payload() payload: OrderUpdateCommandRequest
  ): Promise<OrderUpdateCommandResponse> {
    return this.orderCommandService.updateOrder(payload);
  }

  @MessagePattern(EventTopics.paymentStatusUpdated)
  async onPaymentUpdated(@Payload() payload: PaymentStatusUpdatedEventPayload) {
    await this.orderCommandService.onPaymentStatusUpdated(payload);
  }

  @MessagePattern(CommandTopics.orderClearRead)
  async orderClearRead() {
    await this.orderCommandService.orderClearRead();
  }
}
