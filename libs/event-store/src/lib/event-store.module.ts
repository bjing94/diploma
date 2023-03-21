import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CONNECTION_NAME, ResourceNames } from './event-store.const';
import { EventStoreProductService } from './product/event-store.product.service';
import { EventStoreService } from './event-store.service';
import { EventSchema } from './event.model';
import { EventStoreOrderService } from './order/event-store.order.service';
import { EventStorePaymentService } from './payment/event-store.payment.service';
import { EventStoreKitchenService } from './kitchen/event-store.kitchen.service';

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

  public static registerForOrder(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr, {
          connectionName: CONNECTION_NAME,
        }),
        MongooseModule.forFeature(
          [
            {
              name: ResourceNames.ORDER,
              schema: EventSchema,
            },
            {
              name: ResourceNames.ORDER + '_snapshot',
              schema: EventSchema,
            },
          ],
          CONNECTION_NAME
        ),
      ],
      providers: [EventStoreOrderService],
      exports: [EventStoreOrderService],
    };
  }

  public static registerForPayment(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr, {
          connectionName: CONNECTION_NAME,
        }),
        MongooseModule.forFeature(
          [
            {
              name: ResourceNames.PAYMENT,
              schema: EventSchema,
            },
            {
              name: ResourceNames.PAYMENT + '_snapshot',
              schema: EventSchema,
            },
          ],
          CONNECTION_NAME
        ),
      ],
      providers: [EventStorePaymentService],
      exports: [EventStorePaymentService],
    };
  }

  public static registerForKitchen(connectionStr: string): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        MongooseModule.forRoot(connectionStr, {
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
          ],
          CONNECTION_NAME
        ),
      ],
      providers: [EventStoreKitchenService],
      exports: [EventStoreKitchenService],
    };
  }
}
