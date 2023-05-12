import { Module } from '@nestjs/common';
import StatisticsController from './statistics.controller';
import StatisticsService from './statistics.service';
import EventModule from '../events/event.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [EventModule, ProductModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export default class StatisticsModule {}
