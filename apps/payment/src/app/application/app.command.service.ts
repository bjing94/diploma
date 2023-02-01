import { Injectable } from '@nestjs/common';
import { PaymentCreate } from '@burger-shop/contracts';
import PaymentDomainEntity from '../domain/entity/payment.domain-entity';
import { PaymentStatus } from '@burger-shop/interfaces';
import PaymentRepositoryProvider from './providers/payment.repository-provider';

@Injectable()
export default class AppCommandService {
  constructor(private readonly paymentRepository: PaymentRepositoryProvider) {}

  public async createPayment(
    data: PaymentCreate.Request
  ): Promise<PaymentCreate.Response> {
    const { sum, type } = data;
    const payment = new PaymentDomainEntity(PaymentStatus.PENDING, sum, type);
    await this.paymentRepository.repository.create(payment);
    return { success: true, id: payment.id };
  }
}
