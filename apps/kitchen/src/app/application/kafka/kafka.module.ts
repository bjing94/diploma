import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'kitchen-client',
      [process.env.KAFKA_HOST],
      [QueryTopics.productFind, QueryTopics.productGet]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
