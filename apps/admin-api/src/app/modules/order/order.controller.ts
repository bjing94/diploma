import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import OrderService from './order.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderFindQueryRequest,
  OrderFindQueryResponse,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdateCommandResponse,
} from '@burger-shop/contracts';
import { OrderUpdateHttpRequest } from './dto/order.update.request';
import { OrderStatus } from '@burger-shop/interfaces';

@ApiTags('Order')
@Controller('order')
export default class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({ type: OrderFindQueryResponse })
  @Get()
  async find(
    @Query('filter') filter: OrderFindQueryRequest
  ): Promise<OrderFindQueryResponse> {
    return this.orderService.find(filter);
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
