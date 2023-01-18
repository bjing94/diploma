import { OrderCreated, OrderPayed } from '@burger-shop/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import OrderQueryService from './order.query.service';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Controller()
export default class OrderQueryController {
  constructor(private readonly orderQueryService: OrderQueryService) {}

  @MessagePattern(OrderCreated.topic)
  async onCreated(@Payload() data: OrderCreated.Payload) {
    await this.orderQueryService.onCreated(data);
  }

  @MessagePattern(OrderPayed.topic)
  async onPayed(@Payload() data: OrderPayed.Payload) {
    await this.orderQueryService.onPayed(data);
  }

  // async get(id: string) {
  //   return this.orderRepository.find(id);
  // }
}
