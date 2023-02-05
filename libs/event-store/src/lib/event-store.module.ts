import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventStoreService } from './event-store.service';
import { EventModel, EventSchema } from './event.model';

@Module({})
export class EventStoreModule {
  public static register(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr),
        MongooseModule.forFeature([
          { name: EventModel.name, schema: EventSchema },
        ]),
      ],
      providers: [EventStoreService],
      exports: [EventStoreService],
    };
  }
}
