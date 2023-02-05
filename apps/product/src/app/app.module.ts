import { KafkaProducerModule } from '@burger-shop/kafka-module';
import { Product, ProductSchema } from '@burger-shop/models';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import EventStoreRootModule from './application/event-store/event-store-root.module';
import ProductCommandController from './application/product.command.controller';
import ProductCommandService from './application/product.command.service';
import ProductQueryController from './application/product.query.controller';
import ProductQueryService from './application/product.query.service';
import MenuRepositoryProvider from './application/provider/menu.repository-provider';
import getMongoEventStoreConnectionString from './config/mongoose.config';
import {
  MenuModel,
  MenuSchema,
} from './infrastructure/database/model/menu.model';
import MenuRepository from './infrastructure/database/repository/menu.repository';
import ProductRepository from './infrastructure/database/repository/product.repository';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoEventStoreConnectionString()),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      {
        name: MenuModel.name,
        schema: MenuSchema,
      },
    ]),
    KafkaProducerModule.register('product-consumer', ['localhost:29092'], []),
    EventStoreRootModule,
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
    MenuRepositoryProvider,
  ],
})
export class AppModule {}
