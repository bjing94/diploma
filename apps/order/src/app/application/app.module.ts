import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import getMongoEventStoreConnectionString from '../config/mongoose.config';
import {
  CreateOrderSagaModel,
  CreateOrderSagaSchema,
} from '../infrastructure/database/mongo/model/create-order-saga.model';
import {
  Event,
  EventSchema,
} from '../infrastructure/database/mongo/model/event.model';
import {
  Order,
  OrderSchema,
} from '../infrastructure/database/mongo/model/order.model';

import OrderCommandController from './order.command.controller';
import OrderCommandService from './order.command.service';
import OrderQueryController from './order.query.controller';
import OrderQueryService from './order.query.service';
import CreateOrderSagaRepositoryProvider from './providers/order.create-order-saga.repository-provider';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import OrderRepositoryProvider from './providers/order.repository-provider';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoEventStoreConnectionString()),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: CreateOrderSagaModel.name, schema: CreateOrderSagaSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
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
  controllers: [OrderCommandController, OrderQueryController],
  providers: [
    OrderCommandService,
    OrderQueryService,
    OrderEventSourceRepositoryProvider,
    CreateOrderSagaRepositoryProvider,
    OrderRepositoryProvider,
  ],
})
export class AppModule {}
