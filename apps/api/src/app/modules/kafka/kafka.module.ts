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
      [process.env.KAFKA_HOST],
      [
        CommandTopics.productCreate,
        CommandTopics.productDelete,
        CommandTopics.productUpdate,
        CommandTopics.menuCreate,
        CommandTopics.menuUpdate,
        CommandTopics.orderCreate,
        CommandTopics.orderPay,
        CommandTopics.orderComplete,
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
