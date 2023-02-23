import { Module } from '@nestjs/common';
import MenuModule from './modules/menu/menu.module';
import OrderModule from './modules/order/order.module';

@Module({
  imports: [MenuModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
