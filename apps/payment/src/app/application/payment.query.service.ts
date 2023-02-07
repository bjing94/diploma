import { Injectable } from '@nestjs/common';
import PaymentRepositoryProvider from './providers/payment.repository-provider';
import PaymentMapper from './mapper/payment.mapper';
import {
  PaymentCreatedEventPayload,
  PaymentGetQueryRequest,
  PaymentGetQueryResponse,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';

@Injectable()
export default class PaymentQueryService {
  constructor(private readonly paymentRepository: PaymentRepositoryProvider) {}

  public async getPayment(
    data: PaymentGetQueryRequest
  ): Promise<PaymentGetQueryResponse> {
    const payment = await this.paymentRepository.repository.find(data.id);
    const domain = PaymentMapper.toDomain(payment);
    return { payment: domain };
  }

  public async onPaymentCreated(data: PaymentCreatedEventPayload) {
    const { payment } = data;
    await this.paymentRepository.repository.create(payment);
  }

  public async onPaymentStatusUpdated(data: PaymentStatusUpdatedEventPayload) {
    const { id, status } = data;
    const payment = await this.paymentRepository.repository.find(data.id);
    payment.status = status;
    await this.paymentRepository.repository.update(id, payment);
  }
}
