import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import MenuModule from './modules/menu/menu.module';
import OrderModule from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [MenuModule, OrderModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
