import {
  CookingRequestFindQueryRequest,
  CookingRequestUpdateCommandRequest,
} from '@burger-shop/contracts';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import KitchenService from './kitchen.service';

@ApiTags('Kitchen')
@Controller('kitchen')
export default class KitchenController {
  constructor(private readonly service: KitchenService) {}

  @Get('request')
  public async findRequests(
    @Query('filter') filter: CookingRequestFindQueryRequest
  ) {
    return this.service.findRequest(filter);
  }

  @Get('request/:id')
  public async getRequest(@Param('id') id: string) {
    return this.service.getRequest({ id });
  }

  @Put('request/:id')
  public async updateRequest(
    @Param('id') id: string,
    @Body() dto: CookingRequestUpdateCommandRequest
  ) {
    return this.service.updateCookingRequest({ ...dto, id });
  }

  @Get('stock/:id')
  public async getStock(@Param('id') id: string) {
    return this.service.getStock({ id });
  }

  @ApiOperation({ description: 'Run kitchen events' })
  @Get('run-events')
  public async runKitchenEvents(): Promise<void> {
    return this.service.runEvents();
  }
}
