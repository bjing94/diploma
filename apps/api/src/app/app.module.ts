import { Module } from '@nestjs/common';
import MenuModule from './modules/menu/menu.module';
import OrderModule from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [ProductModule, MenuModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
