import {
  CommandTopics,
  KafkaProducerModule,
  QueryTopics,
} from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register('order-client', ['localhost:29092'], []),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
