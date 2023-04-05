import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import PaymentCommandService from './payment.command.service';
import { CommandTopics } from '@burger-shop/kafka-module';
import {
  PaymentCreateCommandRequest,
  PaymentUpdateCommandRequest,
} from '@burger-shop/contracts';
import LoggerInterceptor from './interceptors/logger.interceptor';

@UseInterceptors(LoggerInterceptor)
@Controller()
export default class PaymentCommandController {
  constructor(private readonly commandService: PaymentCommandService) {}

  @MessagePattern(CommandTopics.paymentCreate)
  public async createPayment(@Payload() payload: PaymentCreateCommandRequest) {
    return this.commandService.createPayment(payload);
  }

  @MessagePattern(CommandTopics.paymentUpdate)
  public async updatePayment(@Payload() payload: PaymentUpdateCommandRequest) {
    return this.commandService.updatePayment(payload);
  }

  @MessagePattern(CommandTopics.paymentRunEvents)
  public async runPaymentEvents() {
    return this.commandService.runPaymentEvents();
  }
}
