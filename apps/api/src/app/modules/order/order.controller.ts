import { Body, Controller, Post } from '@nestjs/common';
import { OrderCreate } from '@burger-shop/contracts';
import OrderService from './order.service';

@Controller('order')
export default class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async create(@Body() dto: OrderCreate.Request) {
    return this.orderService.create(dto);
  }
}
