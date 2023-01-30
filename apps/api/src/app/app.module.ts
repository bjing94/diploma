import { Module } from '@nestjs/common';

import OrderModule from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [OrderModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
