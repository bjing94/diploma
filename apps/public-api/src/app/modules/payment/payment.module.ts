import { Module } from '@nestjs/common';
import KafkaModule from '../kafka/kafka.module';
import PaymentController from './payment.controller';
import PaymentService from './payment.service';

@Module({
  imports: [KafkaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export default class PaymentModule {}
