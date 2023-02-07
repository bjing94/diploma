import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import PaymentCommandService from './payment.command.service';
import { CommandTopics } from '@burger-shop/kafka-module';
import {
  PaymentCreateCommandRequest,
  PaymentFulfillCommandRequest,
} from '@burger-shop/contracts';
@Controller()
export default class PaymentCommandController {
  constructor(private readonly commandService: PaymentCommandService) {}

  @MessagePattern(CommandTopics.paymentCreate)
  public async createPayment(@Payload() payload: PaymentCreateCommandRequest) {
    return this.commandService.createPayment(payload);
  }

  @MessagePattern(CommandTopics.paymentFulfill)
  public async fulfillPayment(
    @Payload() payload: PaymentFulfillCommandRequest
  ) {
    return this.commandService.fulfillPayment(payload);
  }
}
