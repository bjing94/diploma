import { EventStoreModule } from '@burger-shop/event-store';
import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { Product, ProductSchema } from '@burger-shop/models';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProductCommandController from './application/product.command.controller';
import ProductCommandService from './application/product.command.service';
import ProductQueryController from './application/product.query.controller';
import ProductQueryService from './application/product.query.service';
import {
  getMongoConnectionStringEventStore,
  getMongoConnectionStringReadDb,
  READ_CONNECTION_NAME,
} from './config/mongoose.config';
import {
  MenuModel,
  MenuSchema,
} from './infrastructure/database/model/menu.model';
import {
  SnapshotModel,
  SnapshotSchema,
} from './infrastructure/database/model/snapshot.model';
import MenuRepository from './infrastructure/database/repository/menu.repository';
import ProductRepository from './infrastructure/database/repository/product.repository';
import SnapshotRepository from './infrastructure/database/repository/snapshot.repository';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoConnectionStringReadDb(), {
      connectionName: READ_CONNECTION_NAME,
    }),
    MongooseModule.forFeature(
      [
        { name: Product.name, schema: ProductSchema },
        {
          name: MenuModel.name,
          schema: MenuSchema,
        },
        {
          name: SnapshotModel.name,
          schema: SnapshotSchema,
        },
      ],
      READ_CONNECTION_NAME
    ),
    KafkaProducerModule.register('product-consumer', ['localhost:29092'], []),
    EventStoreModule.registerForProduct(getMongoConnectionStringEventStore()),
  ],
  controllers: [ProductQueryController, ProductCommandController],
  providers: [
    ProductQueryService,
    ProductCommandService,
    {
      provide: 'ProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'MenuRepository',
      useClass: MenuRepository,
    },
    {
      provide: 'SnapshotRepository',
      useClass: SnapshotRepository,
    },
  ],
})
export class AppModule {}
