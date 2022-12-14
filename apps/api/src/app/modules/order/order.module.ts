import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from '../../config/provide-kafka-config';
import OrderController from './order.controller';
import OrderService from './order.service';

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
  providers: [OrderService],
  controllers: [OrderController],
})
export default class OrderModule {}
