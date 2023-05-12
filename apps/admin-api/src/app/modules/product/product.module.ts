import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from '../../config/provide-kafka-config';
import KafkaModule from '../kafka/kafka.module';
import ProductController from './product.controller';
import ProductService from './product.service';

@Module({
  imports: [
    KafkaModule,
    ClientsModule.register([
      {
        name: kafkaConfig.clientName,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-producer',
            brokers: [process.env.KAFKA_HOST],
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
