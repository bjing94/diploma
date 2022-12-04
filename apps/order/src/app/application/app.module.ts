import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import getMongoConnectionString from '../config/mongoose.config';
import {
  Event,
  EventSchema,
} from '../infrastructure/database/mongo/model/event.model';

import OrderCommandController from './order.command.controller';
import OrderCommandService from './order.command.service';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoConnectionString()),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
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
  controllers: [OrderCommandController],
  providers: [OrderCommandService, OrderEventSourceRepositoryProvider],
})
export class AppModule {}
