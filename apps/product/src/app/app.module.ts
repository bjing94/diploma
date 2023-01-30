import { Product, ProductSchema } from '@burger-shop/models';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProductCommandController from './application/product.command.controller';
import ProductCommandService from './application/product.command.service';
import ProductQueryController from './application/product.query.controller';
import ProductQueryService from './application/product.query.service';
import ProductRepositoryProvider from './application/provider/product.repository-provider';
import getMongoEventStoreConnectionString from './config/mongoose.config';
import { KafkaProducerModule } from './infrastructure/kafka/kafka-producer';

@Module({
  imports: [
    MongooseModule.forRoot(getMongoEventStoreConnectionString()),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    KafkaProducerModule,
  ],
  controllers: [ProductQueryController, ProductCommandController],
  providers: [
    ProductRepositoryProvider,
    ProductQueryService,
    ProductCommandService,
  ],
})
export class AppModule {}
