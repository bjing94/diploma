import { Controller } from '@nestjs/common';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Controller()
export default class OrderQueryController {
  constructor(private readonly orderRepository: OrderAbstractRepository) {}

  async get(id: string) {
    return this.orderRepository.find(id);
  }

  async create(id: string) {
    return this.orderRepository.find(id);
  }
}
