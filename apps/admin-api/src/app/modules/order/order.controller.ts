import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import OrderService from './order.service';
import { ApiBody, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
} from '@burger-shop/contracts';
import { OrderUpdateHttpRequest } from './dto/order.update.request';

@ApiTags('Order')
@Controller('order')
export default class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health')
  async healthcheck() {
    return { data: 'OK' };
  }

  @ApiResponse({ type: OrderCreateCommandResponse })
  @ApiBody({ type: OrderCreateCommandRequest })
  @Post('create')
  async create(
    @Body() dto: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    return this.orderService.create(dto);
  }

  @ApiResponse({ type: OrderGetQueryRequest })
  @Get(':id')
  async get(@Param('id') id: string): Promise<OrderGetQueryResponse> {
    return this.orderService.get(id);
  }

  @ApiResponse({ type: OrderUpdateCommandResponse })
  @Put(':id')
  async pay(
    @Param('id') id: string,
    @Body() dto: OrderUpdateHttpRequest
  ): Promise<OrderUpdateCommandResponse> {
    return this.orderService.update({ id, ...dto });
  }
}
