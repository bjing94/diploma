import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppCommand } from './app.command';
import { CommandModule } from 'nestjs-command';
import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { EventStoreModule } from '@burger-shop/event-store';

@Module({
  imports: [
    CommandModule,
    KafkaProducerModule.register('cli-producer', ['localhost:29092'], []),
    EventStoreModule.registerForProduct(
      'mongodb://root:root@localhost:27017/?authMechanism=DEFAULT'
    ),
  ],
  controllers: [AppController],
  providers: [AppService, AppCommand],
})
export class AppModule {}
