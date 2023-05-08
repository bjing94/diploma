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
import { KafkaProducerService } from '@burger-shop/kafka-module';
import {
  EventStorePaymentService,
  PaymentEventNames,
} from '@burger-shop/event-store';
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
      name: PaymentEventNames.paymentCreated,
      payload: JSON.stringify(payload),
      objectId: payment.id,
    });
    return { id: payment.id };
  }

  public async updatePayment(
    data: PaymentUpdateCommandRequest
  ): Promise<PaymentUpdateCommandResponse> {
    if (data.status === PaymentStatus.FULFILLED) {
      return this.fulfillPayment(data);
    }
    if (data.status === PaymentStatus.REJECTED) {
      return this.rejectPayment(data);
    }
    if (data.status === PaymentStatus.REFUNDED) {
      return this.refundPayment(data);
    }
  }

  public async fulfillPayment(
    data: PaymentUpdateCommandRequest
  ): Promise<PaymentUpdateCommandResponse> {
    const { id } = data;
    const payment = await this.paymentRepository.find(id);
    // console.log()
    if (!payment) return { success: false };
    if (payment.status !== PaymentStatus.PENDING) return { success: false };

    const payload: PaymentStatusUpdatedEventPayload = {
      id,
      status: data.status,
      orderId: payment.orderId,
      eventName: PaymentEventNames.paymentFulfilled,
    };

    await this.kafkaManagerService.emitPaymentStatusUpdated(payload);
    await this.eventStoreService.savePaymentEvent({
      name: PaymentEventNames.paymentFulfilled,
      payload: JSON.stringify(payload),
      objectId: id,
    });
    return { success: true };
  }

  public async rejectPayment(
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
      eventName: PaymentEventNames.paymentRejected,
    };

    await this.kafkaManagerService.emitPaymentStatusUpdated(payload);
    await this.eventStoreService.savePaymentEvent({
      name: PaymentEventNames.paymentRejected,
      payload: JSON.stringify(payload),
      objectId: id,
    });
    return { success: true };
  }

  public async refundPayment(
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
      eventName: PaymentEventNames.paymentRefunded,
    };

    await this.kafkaManagerService.emitPaymentStatusUpdated(payload);
    await this.eventStoreService.savePaymentEvent({
      name: PaymentEventNames.paymentRefunded,
      payload: JSON.stringify(payload),
      objectId: id,
    });
    return { success: true };
  }

  async paymentClearRead() {
    await this.paymentRepository.clearAll();
  }
}
