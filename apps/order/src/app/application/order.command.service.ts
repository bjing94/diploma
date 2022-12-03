import { Injectable } from '@nestjs/common';
import { OrderCreate } from '@burger-shop/contracts';
import OrderDomainEntity from '../domain/entity/order.domain-entity';

@Injectable()
export default class OrderCommandService {
  public async create(dto: OrderCreate.Request) {
    console.log('Creating order', dto);
    return new OrderDomainEntity(2, []);
  }
}
