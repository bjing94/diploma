import { Controller, Get, Param } from '@nestjs/common';
import StatisticsService from './statistics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Статистика')
@Controller('statistics')
export default class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('cooking-time/:id')
  public async getCookingTime(@Param('id') id: string) {
    return this.statisticsService.getCookingTimeStatistics(id);
  }

  @Get('pickup-time')
  public async getPickupTime() {
    return this.statisticsService.getPickupTimeStatistics();
  }

  @Get('popular-products')
  public async getPopularProducts() {
    return this.statisticsService.getPopularProductsStatistics();
  }

  @Get('canceled-orders')
  public async getCanceledOrders() {
    return this.statisticsService.getCanceledOrdersStatistics();
  }
}
