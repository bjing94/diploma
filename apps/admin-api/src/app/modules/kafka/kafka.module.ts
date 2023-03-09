import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'admin-api-producer',
      ['localhost:29092'],
      [
        CommandTopics.productCreate,
        CommandTopics.productDelete,
        CommandTopics.productUpdate,
        CommandTopics.menuCreate,
        CommandTopics.menuUpdate,
        CommandTopics.orderUpdate,
        CommandTopics.orderCreate,
        QueryTopics.menuGet,
        QueryTopics.productGet,
        QueryTopics.productFind,
        QueryTopics.orderGet,
        QueryTopics.menuItemGet,
        QueryTopics.menuFind,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
