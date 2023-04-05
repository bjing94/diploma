import { Inject, Injectable } from '@nestjs/common';
import {
  PaymentCreateCommandRequest,
  PaymentCreateCommandResponse,
  PaymentUpdateCommandRequest,
  PaymentUpdateCommandResponse,
  PaymentStatusUpdatedEventPayload,
  PaymentCreatedEventPayload,
} from '@burger-shop/contracts';
import { PaymentStatus } from '@burger-shop/interfaces';
import PaymentAbstractRepository from './repository/payment.abstract-repository';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { EventStorePaymentService } from '@burger-shop/event-store';
import { PaymentDomainEntity } from '@burger-shop/domain-entity';

@Injectable()
export default class PaymentCommandService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentAbstractRepository,
    private readonly kafkaManagerService: KafkaProducerService,
    private readonly eventStoreService: EventStorePaymentService
  ) {}

  public async createPayment(
    data: PaymentCreateCommandRequest
  ): Promise<PaymentCreateCommandResponse> {
    const { sum, type } = data;
    const payment = new PaymentDomainEntity({
      sum,
      type,
      status: PaymentStatus.PENDING,
      orderId: data.orderId,
    });
    const payload: PaymentCreatedEventPayload = {
      payment: {
        id: payment.id,
        status: payment.status,
        sum: payment.sum,
        type: payment.type,
        orderId: data.orderId,
      },
    };
    await this.kafkaManagerService.emitPaymentCreated(payload);
    await this.eventStoreService.savePaymentEvent({
      name: EventTopics.paymentCreated,
      payload: JSON.stringify(payload),
      objectId: payment.id,
    });
    return { id: payment.id };
  }

  public async updatePayment(
    data: PaymentUpdateCommandRequest
  ): Promise<PaymentUpdateCommandResponse> {
    const { id } = data;
    const payment = await this.paymentRepository.find(id);
    if (!payment) return { success: false };
    if (payment.status !== PaymentStatus.PENDING) return { success: false };

    const payload: PaymentStatusUpdatedEventPayload = {
      id,
      status: data.status,
      orderId: payment.orderId,
    };
    await this.kafkaManagerService.emitPaymentStatusUpdated(payload);
    await this.eventStoreService.savePaymentEvent({
      name: EventTopics.paymentStatusUpdated,
      payload: JSON.stringify(payload),
      objectId: id,
    });
    return { success: true };
  }

  async runPaymentEvents() {
    try {
      await this.paymentRepository.clearAll();
      const events = await this.eventStoreService.getPaymentEvents({});
      console.log(`Events:`, events.length);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        await this.kafkaManagerService.emit(event.name, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
