import { Injectable } from '@nestjs/common';
import {
  PaymentCreated,
  PaymentGet,
  PaymentStatusUpdated,
} from '@burger-shop/contracts';
import PaymentRepositoryProvider from './providers/payment.repository-provider';
import PaymentMapper from './mapper/payment.mapper';

@Injectable()
export default class PaymentQueryService {
  constructor(private readonly paymentRepository: PaymentRepositoryProvider) {}

  public async getPayment(
    data: PaymentGet.Request
  ): Promise<PaymentGet.Response> {
    const payment = await this.paymentRepository.repository.find(data.id);
    const domain = PaymentMapper.toDomain(payment);
    return { payment: domain };
  }

  public async onPaymentCreated(data: PaymentCreated.Payload) {
    const { payment } = data;
    await this.paymentRepository.repository.create(payment);
  }

  public async onPaymentStatusUpdated(data: PaymentStatusUpdated.Payload) {
    const { id, status } = data;
    const payment = await this.paymentRepository.repository.find(data.id);
    payment.status = status;
    await this.paymentRepository.repository.update(id, payment);
  }
}
