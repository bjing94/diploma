import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from '../../config/provide-kafka-config';
import ProductController from './product.controller';
import ProductService from './product.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: kafkaConfig.clientName,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-producer',
            brokers: ['localhost:29092'],
          },
        },
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
