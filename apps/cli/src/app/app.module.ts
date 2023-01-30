import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppCommand } from './app.command';
import getMongoEventStoreConnectionStringOrder, {
  DatabaseNames,
} from '../config/mongoose.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './config/provide-kafka-config';
import { CommandModule } from 'nestjs-command';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import { Event, EventSchema } from '@burger-shop/models';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoEventStoreConnectionStringOrder(), {
      connectionName: DatabaseNames.orderEvents,
    }),
    MongooseModule.forFeature(
      [{ name: Event.name, schema: EventSchema }],
      DatabaseNames.orderEvents
    ),
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
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppCommand, OrderEventSourceRepositoryProvider],
})
export class AppModule {}
