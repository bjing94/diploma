import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OrderAbstractRepository from 'apps/order/src/app/repository/order.abstract-repository';
import OrderDomainEntity from 'apps/order/src/domain/order.domain-entity';
import { Repository } from 'typeorm';
import OrderEntity from '../entity/order.entity';

@Injectable()
export default class OrderRepository implements OrderAbstractRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>
  ) {}

  public async find(id: string): Promise<OrderDomainEntity> {
    const result = await this.orderRepository.findOneBy({ id: id });
    return new OrderDomainEntity();
  }
  public create(order: OrderDomainEntity): Promise<OrderDomainEntity> {
    throw new Error('Method not implemented.');
  }
  public update(
    id: string,
    order: OrderDomainEntity
  ): Promise<OrderDomainEntity> {
    throw new Error('Method not implemented.');
  }
  public delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
