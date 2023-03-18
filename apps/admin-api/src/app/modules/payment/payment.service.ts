import { PaymentStatus } from '@burger-shop/interfaces';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PaymentService {
  constructor(private readonly kafkaManager: KafkaProducerService) {}

  public async getPayment(id: string) {
    return this.kafkaManager.sendPaymentGet({ id });
  }

  public async updatePayment(id: string, status: PaymentStatus) {
    return this.kafkaManager.sendPaymentUpdate({ id, status });
  }
}
