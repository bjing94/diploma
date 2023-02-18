import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import {
  PaymentCreateCommandRequest,
  PaymentCreateCommandResponse,
  PaymentFulfillCommandRequest,
  PaymentFulfillCommandResponse,
} from '@burger-shop/contracts';
import PaymentDomainEntity from '../domain/entity/payment.domain-entity';
import { PaymentStatus } from '@burger-shop/interfaces';
import PaymentMapper from './mapper/payment.mapper';
import PaymentAbstractRepository from './repository/payment.abstract-repository';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import LoggerInterceptor from './interceptors/logger.interceptor';
import { EventStoreService } from '@burger-shop/event-store';

@Injectable()
export default class PaymentCommandService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentAbstractRepository,
    private readonly kafkaManagerService: KafkaProducerService,
    private readonly eventStoreService: EventStoreService
  ) {}

  public async createPayment(
    data: PaymentCreateCommandRequest
  ): Promise<PaymentCreateCommandResponse> {
    const { sum, type } = data;
    const payment = new PaymentDomainEntity(sum, type, PaymentStatus.PENDING);
    const payload = {
      payment: {
        _id: payment.id,
        status: payment.status,
        sum: payment.sum,
        type: payment.type,
      },
    };
    await this.kafkaManagerService.emitPaymentCreated(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.paymentCreated,
      payload: JSON.stringify(payload),
    });
    return { success: true, id: payment.id };
  }

  public async fulfillPayment(
    data: PaymentFulfillCommandRequest
  ): Promise<PaymentFulfillCommandResponse> {
    const { id, hash } = data;
    const payment = await this.paymentRepository.find(id);
    console.log(payment);
    if (!payment) return { success: false };
    const payload = {
      id,
      status: PaymentStatus.FULFILLED,
    };
    await this.kafkaManagerService.emitPaymentStatusUpdated(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.paymentStatusUpdated,
      payload: JSON.stringify(payload),
    });
    return { success: true };
  }
}
