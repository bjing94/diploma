import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register(
      'payment-client',
      [process.env.KAFKA_HOST],
      []
    ),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaRootModule {}
