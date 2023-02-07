import { Injectable } from '@nestjs/common';
import {
  PaymentCreateCommandRequest,
  PaymentCreateCommandResponse,
  PaymentFulfillCommandRequest,
  PaymentFulfillCommandResponse,
} from '@burger-shop/contracts';
import PaymentDomainEntity from '../domain/entity/payment.domain-entity';
import { PaymentStatus } from '@burger-shop/interfaces';
import PaymentRepositoryProvider from './providers/payment.repository-provider';
import PaymentMapper from './mapper/payment.mapper';

@Injectable()
export default class PaymentCommandService {
  constructor(private readonly paymentRepository: PaymentRepositoryProvider) {}

  public async createPayment(
    data: PaymentCreateCommandRequest
  ): Promise<PaymentCreateCommandResponse> {
    const { sum, type } = data;
    const payment = new PaymentDomainEntity(sum, type, PaymentStatus.PENDING);
    return { success: true, id: payment.id };
  }

  public async fulfillPayment(
    data: PaymentFulfillCommandRequest
  ): Promise<PaymentFulfillCommandResponse> {
    const { id, hash } = data;
    const payment = await this.paymentRepository.repository.find(id);
    const domain = PaymentMapper.toDomain(payment);
    domain.status = PaymentStatus.FULFILLED;
    return { success: true };
  }
}
