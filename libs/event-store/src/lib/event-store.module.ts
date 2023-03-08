import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CONNECTION_NAME, ResourceNames } from './event-store.const';
import { EventStoreProductService } from './product/event-store.product.service';
import { EventStoreService } from './event-store.service';
import { EventSchema } from './event.model';

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
          [
            {
              name: ResourceNames.PRODUCT,
              schema: EventSchema,
            },
            {
              name: ResourceNames.ORDER,
              schema: EventSchema,
            },
            {
              name: ResourceNames.MENU,
              schema: EventSchema,
            },
            {
              name: ResourceNames.PAYMENT,
              schema: EventSchema,
            },
          ],
          CONNECTION_NAME
        ),
      ],
      providers: [EventStoreService],
      exports: [EventStoreService],
    };
  }

  public static registerForProduct(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr, {
          connectionName: CONNECTION_NAME,
        }),
        MongooseModule.forFeature(
          [
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
      providers: [EventStoreProductService],
      exports: [EventStoreProductService],
    };
  }
}
