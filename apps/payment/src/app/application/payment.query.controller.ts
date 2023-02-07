import {
  PaymentCreatedEventPayload,
  PaymentGetQueryRequest,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, QueryTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import PaymentQueryService from './payment.query.service';

@Controller()
export default class PaymentQueryController {
  constructor(private readonly paymentQueryService: PaymentQueryService) {}

  @MessagePattern(EventTopics.paymentCreated)
  public async onPaymentCreated(@Payload() data: PaymentCreatedEventPayload) {
    return this.onPaymentCreated(data);
  }

  @MessagePattern(EventTopics.paymentStatusUpdated)
  public async onPaymentStatusUpdated(
    @Payload() data: PaymentStatusUpdatedEventPayload
  ) {
    return this.onPaymentStatusUpdated(data);
  }

  @MessagePattern(QueryTopics.paymentGet)
  public async onPaymentGet(@Payload() data: PaymentGetQueryRequest) {
    return this.paymentQueryService.getPayment(data);
  }
}
