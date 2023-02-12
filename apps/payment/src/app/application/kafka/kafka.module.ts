import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    KafkaProducerModule.register('payment-client', ['localhost:29092'], []),
  ],
  exports: [KafkaProducerModule],
})
export default class KafkaRootModule {}
