import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CONNECTION_NAME } from './event-store.const';
import { EventStoreService } from './event-store.service';
import { EventModel, EventSchema } from './event.model';

@Module({})
export class EventStoreModule {
  public static register(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr, {
          connectionName: CONNECTION_NAME,
        }),
        MongooseModule.forFeature(
          [{ name: EventModel.name, schema: EventSchema }],
          CONNECTION_NAME
        ),
      ],
      providers: [EventStoreService],
      exports: [EventStoreService],
    };
  }
}
