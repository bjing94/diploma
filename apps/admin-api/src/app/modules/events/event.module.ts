import { EventSchema } from '@burger-shop/models';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CONNECTION_NAME,
  ResourceNames,
  getMongoConnectionStringEventStore,
} from './event.const';
import EventController from './event.controller';
import EventService from './event.service';
import KafkaModule from '../kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forRoot(getMongoConnectionStringEventStore(), {
      connectionName: CONNECTION_NAME,
    }),
    MongooseModule.forFeature(
      [
        {
          name: ResourceNames.COOKING_REQUEST,
          schema: EventSchema,
        },
        {
          name: ResourceNames.COOKING_REQUEST + '_snapshot',
          schema: EventSchema,
        },
        {
          name: ResourceNames.COOKING_STOCK,
          schema: EventSchema,
        },
        {
          name: ResourceNames.COOKING_STOCK + '_snapshot',
          schema: EventSchema,
        },
        {
          name: ResourceNames.PAYMENT,
          schema: EventSchema,
        },
        {
          name: ResourceNames.PAYMENT + '_snapshot',
          schema: EventSchema,
        },
        {
          name: ResourceNames.ORDER,
          schema: EventSchema,
        },
        {
          name: ResourceNames.ORDER + '_snapshot',
          schema: EventSchema,
        },
        {
          name: ResourceNames.PRODUCT,
          schema: EventSchema,
        },
        {
          name: ResourceNames.MENU,
          schema: EventSchema,
        },
        {
          name: ResourceNames.PRODUCT + '_snapshot',
          schema: EventSchema,
        },
        {
          name: ResourceNames.MENU + '_snapshot',
          schema: EventSchema,
        },
      ],
      CONNECTION_NAME
    ),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export default class EventModule {}
