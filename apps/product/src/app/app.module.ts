import { Module } from '@nestjs/common';
import ProductQueryController from './application/product/product.query.controller';
import ProductQueryService from './application/product/product.query.service';
import ProductRepositoryProvider from './application/provider/product.repository-provider';

@Module({
  imports: [],
  controllers: [ProductQueryController],
  providers: [ProductRepositoryProvider, ProductQueryService],
})
export class AppModule {}
