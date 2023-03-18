import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'order-client',
      ['localhost:29092'],
      [
        QueryTopics.menuItemGet,
        CommandTopics.paymentCreate,
        CommandTopics.paymentUpdate,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
