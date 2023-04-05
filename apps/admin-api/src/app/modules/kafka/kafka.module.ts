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
        // run events
        CommandTopics.productRunEvents,
        CommandTopics.orderRunEvents,
        CommandTopics.kitchenRunEvents,
        CommandTopics.paymentRunEvents,
        CommandTopics.menuCreate,
        CommandTopics.menuUpdate,
        CommandTopics.orderUpdate,
        CommandTopics.orderCreate,
        CommandTopics.paymentCreate,
        CommandTopics.paymentUpdate,
        CommandTopics.cookingRequestCreate,
        CommandTopics.cookingRequestUpdate,
        CommandTopics.cookingStockAdd,
        QueryTopics.menuGet,
        QueryTopics.productGet,
        QueryTopics.productFind,
        QueryTopics.orderGet,
        QueryTopics.orderFind,
        QueryTopics.menuItemGet,
        QueryTopics.menuFind,
        QueryTopics.paymentGet,
        QueryTopics.cookingRequestGet,
        QueryTopics.cookingStockGet,
        QueryTopics.cookingRequestFind,
      ]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
