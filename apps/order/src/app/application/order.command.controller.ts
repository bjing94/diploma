import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderCreate, OrderPay } from '@burger-shop/contracts';
import OrderCommandService from './order.command.service';

@Controller()
export default class OrderCommandController {
  constructor(private readonly service: OrderCommandService) {}

  @MessagePattern(OrderCreate.topic)
  create(@Payload() dto: OrderCreate.Request): Promise<any> {
    return this.service.createOrder(dto);
  }

  @MessagePattern(OrderPay.topic)
  pay(@Payload() dto: OrderPay.Request): Promise<any> {
    return this.service.payOrder(dto.orderId);
  }
}
