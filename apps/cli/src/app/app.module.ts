import { AppService } from './app.service';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppCommand } from './app.command';
import getMongoEventStoreConnectionStringOrder from '../config/mongoose.config';
import { CommandModule } from 'nestjs-command';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import { Event, EventSchema } from '@burger-shop/models';
import { Connection } from 'mongoose';
import { KafkaProducerModule } from '@burger-shop/kafka-module';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoEventStoreConnectionStringOrder(), {
      connectionFactory: (connection: Connection) => {
        if (connection.readyState === 1) {
          Logger.log('DB connected');
        }

        connection.on('disconnected', () => {
          Logger.log('DB disconnected');
        });
        connection.on('error', () => {
          Logger.log('Error');
        });
        return connection;
      },
    }),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    CommandModule,
    KafkaProducerModule.register('cli-producer', ['localhost:29092']),
  ],
  controllers: [AppController],
  providers: [AppService, AppCommand, OrderEventSourceRepositoryProvider],
})
export class AppModule {}
