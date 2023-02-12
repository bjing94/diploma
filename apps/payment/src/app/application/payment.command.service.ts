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
import { KafkaProducerService } from '@burger-shop/kafka-module';
import LoggerInterceptor from './interceptors/logger.interceptor';

@Injectable()
export default class PaymentCommandService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentAbstractRepository,
    private readonly kafkaManagerService: KafkaProducerService
  ) {}

  public async createPayment(
    data: PaymentCreateCommandRequest
  ): Promise<PaymentCreateCommandResponse> {
    const { sum, type } = data;
    const payment = new PaymentDomainEntity(sum, type, PaymentStatus.PENDING);
    await this.kafkaManagerService.emitPaymentCreated({
      payment: {
        id: payment.id,
        status: payment.status,
        sum: payment.sum,
        type: payment.type,
      },
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
    // const domain = PaymentMapper.toDomain(payment);
    // domain.status = PaymentStatus.FULFILLED;
    console.log('fulfill payment');
    await this.kafkaManagerService.emitPaymentStatusUpdated({
      id,
      status: PaymentStatus.FULFILLED,
    });
    return { success: true };
  }
}
