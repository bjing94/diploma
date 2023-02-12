import { Inject, Injectable } from '@nestjs/common';
import PaymentMapper from './mapper/payment.mapper';
import {
  PaymentCreatedEventPayload,
  PaymentGetQueryRequest,
  PaymentGetQueryResponse,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import PaymentAbstractRepository from './repository/payment.abstract-repository';

@Injectable()
export default class PaymentQueryService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentAbstractRepository
  ) {}

  public async getPayment(
    data: PaymentGetQueryRequest
  ): Promise<PaymentGetQueryResponse> {
    const payment = await this.paymentRepository.find(data.id);
    const domain = PaymentMapper.toDomain(payment);
    return { payment: domain };
  }

  public async onPaymentCreated(data: PaymentCreatedEventPayload) {
    const { payment } = data;
    await this.paymentRepository.create(payment);
  }

  public async onPaymentStatusUpdated(data: PaymentStatusUpdatedEventPayload) {
    const { id, status } = data;
    const payment = await this.paymentRepository.find(data.id);
    payment.status = status;
    await this.paymentRepository.update(id, payment);
  }
}
