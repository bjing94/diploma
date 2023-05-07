import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import OrderModule from './modules/order/order.module';
import MenuModule from './modules/menu/menu.module';

@Module({
  imports: [OrderModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
