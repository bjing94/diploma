import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderCreate, OrderGetOrder } from '@burger-shop/contracts';
import OrderService from './order.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('order')
export default class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health')
  async healthcheck() {
    return { data: 'OK' };
  }

  @ApiResponse({ type: OrderCreate.Response })
  @Post('create')
  async create(
    @Body() dto: OrderCreate.Request
  ): Promise<OrderCreate.Response> {
    return this.orderService.create(dto);
  }

  @ApiResponse({ type: OrderGetOrder.Response })
  @Get(':id')
  async get(@Param('id') id: string): Promise<OrderGetOrder.Response> {
    return this.orderService.get(id);
  }
}
