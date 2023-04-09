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
        QueryTopics.cookingStockGet,
        QueryTopics.cookingRequestGet,
        CommandTopics.paymentCreate,
        CommandTopics.paymentUpdate,
        CommandTopics.cookingStockAdd,
        CommandTopics.cookingRequestCreate,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
