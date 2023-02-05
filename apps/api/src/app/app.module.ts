import { Module } from '@nestjs/common';
import MenuModule from './modules/menu/menu.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [ProductModule, MenuModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
