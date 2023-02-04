// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import {
//   OrderComplete,
//   OrderCreate,
//   OrderGetOrder,
//   OrderPay,
// } from '@burger-shop/contracts';
// import OrderService from './order.service';
// import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('Order')
// @Controller('order')
// export default class OrderController {
//   constructor(private readonly orderService: OrderService) {}

//   @Get('health')
//   async healthcheck() {
//     return { data: 'OK' };
//   }

//   @ApiResponse({ type: OrderCreate.Response })
//   @ApiBody({ type: OrderCreate.Request })
//   @Post('create')
//   async create(
//     @Body() dto: OrderCreate.Request
//   ): Promise<OrderCreate.Response> {
//     return this.orderService.create(dto);
//   }

//   @ApiResponse({ type: OrderGetOrder.Response })
//   @Get(':id')
//   async get(@Param('id') id: string): Promise<OrderGetOrder.Response> {
//     return this.orderService.get(id);
//   }

//   @ApiResponse({ type: OrderPay.Response })
//   @Post(':id/pay')
//   async pay(@Param('id') id: string): Promise<OrderPay.Response> {
//     return this.orderService.pay(id);
//   }

//   @ApiResponse({ type: OrderComplete.Response })
//   @Post(':id/complete')
//   async complete(@Param('id') id: string): Promise<OrderComplete.Response> {
//     return this.orderService.complete(id);
//   }
// }
