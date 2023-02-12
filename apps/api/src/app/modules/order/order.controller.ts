import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import OrderService from './order.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  OrderCompleteCommandRequest,
  OrderCompleteCommandResponse,
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderPayCommandRequest,
  OrderPayCommandResponse,
} from '@burger-shop/contracts';

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

  @ApiResponse({ type: OrderPayCommandRequest })
  @Post(':id/pay')
  async pay(@Param('id') id: string): Promise<OrderPayCommandResponse> {
    return this.orderService.pay(id);
  }

  @ApiResponse({ type: OrderCompleteCommandRequest })
  @Post(':id/complete')
  async complete(
    @Param('id') id: string
  ): Promise<OrderCompleteCommandResponse> {
    return this.orderService.complete(id);
  }
}
