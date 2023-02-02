import { PaymentCreate, PaymentFulfill } from '@burger-shop/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import PaymentCommandService from './payment.command.service';

@Controller()
export default class PaymentCommandController {
  constructor(private readonly commandService: PaymentCommandService) {}

  @MessagePattern(PaymentCreate.topic)
  public async createPayment(@Payload() payload: PaymentCreate.Request) {
    return this.commandService.createPayment(payload);
  }

  @MessagePattern(PaymentFulfill.topic)
  public async fulfillPayment(@Payload() payload: PaymentFulfill.Request) {
    return this.commandService.fulfillPayment(payload);
  }
}
