import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import KitchenModule from './modules/kitchen/kitchen.module';
import MenuModule from './modules/menu/menu.module';
import OrderModule from './modules/order/order.module';
import PaymentModule from './modules/payment/payment.module';
import { ProductModule } from './modules/product/product.module';
import EventModule from './modules/events/event.module';

@Module({
  imports: [
    MenuModule,
    OrderModule,
    ProductModule,
    PaymentModule,
    KitchenModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
