import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'public-api-producer',
      [process.env.KAFKA_HOST],
      [
        // run events
        CommandTopics.orderCreate,
        CommandTopics.paymentUpdate,
        QueryTopics.menuGet,
        QueryTopics.productGet,
        QueryTopics.productFind,
        QueryTopics.orderGet,
        QueryTopics.orderFind,
        QueryTopics.menuItemGet,
        QueryTopics.menuFind,
        QueryTopics.paymentGet,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
