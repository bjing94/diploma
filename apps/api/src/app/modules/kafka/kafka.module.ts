import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'api-producer',
      ['localhost:29092'],
      [
        CommandTopics.productCreate,
        CommandTopics.productDelete,
        CommandTopics.productUpdate,
        CommandTopics.menuCreate,
        CommandTopics.orderCreate,
        CommandTopics.orderPay,
        CommandTopics.orderComplete,
        QueryTopics.menuGet,
        QueryTopics.productGet,
        QueryTopics.productFind,
        QueryTopics.orderGet,
        QueryTopics.menuItemGet,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
