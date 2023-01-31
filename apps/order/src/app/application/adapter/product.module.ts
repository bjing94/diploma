import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import ProductAdapterService from './product.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-client',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'order-consumer',
          },
        },
      },
    ]),
  ],
  providers: [ProductAdapterService],
  exports: [ProductAdapterService],
})
export default class ProductAdapterModule {}
