import { AppService } from './app.service';
import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppCommand } from './app.command';
import getMongoEventStoreConnectionStringEventStore from '../config/mongoose.config';
import { CommandModule } from 'nestjs-command';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';
import { Event, EventSchema } from '@burger-shop/models';
import { Connection } from 'mongoose';
import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { EventStoreModule } from '@burger-shop/event-store';

@Module({
  imports: [
    CommandModule,
    KafkaProducerModule.register('cli-producer', ['localhost:29092'], []),
    EventStoreModule.register(
      'mongodb://root:root@localhost:27017/?authMechanism=DEFAULT'
    ),
  ],
  controllers: [AppController],
  providers: [AppService, AppCommand],
})
export class AppModule {}
