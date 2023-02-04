import { CommandTopics, KafkaProducerModule } from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'api-producer',
      ['localhost:29092'],
      [CommandTopics.productCreate]
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaModule {}
