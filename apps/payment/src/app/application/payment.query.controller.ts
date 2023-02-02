import {
  PaymentCreated,
  PaymentGet,
  PaymentStatusUpdated,
} from '@burger-shop/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import PaymentQueryService from './payment.query.service';

@Controller()
export default class PaymentQueryController {
  constructor(private readonly paymentQueryService: PaymentQueryService) {}

  @MessagePattern(PaymentCreated.topic)
  public async onPaymentCreated(@Payload() data: PaymentCreated.Payload) {
    return this.onPaymentCreated(data);
  }

  @MessagePattern(PaymentStatusUpdated.topic)
  public async onPaymentStatusUpdated(
    @Payload() data: PaymentStatusUpdated.Payload
  ) {
    return this.onPaymentStatusUpdated(data);
  }

  @MessagePattern(PaymentGet.topic)
  public async onPaymentGet(@Payload() data: PaymentGet.Request) {
    return this.paymentQueryService.getPayment(data);
  }
}
