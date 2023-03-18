import {
  OrderCreatedEventPayload,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdatedEventPayload,
} from '@burger-shop/contracts';
import { OrderStatus } from '@burger-shop/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Injectable()
export default class OrderQueryService {
  constructor(
    @Inject('OrderRepository')
    private readonly repository: OrderAbstractRepository
  ) {}

  async getOrder(data: OrderGetQueryRequest): Promise<OrderGetQueryResponse> {
    const result = await this.repository.find(data.id);
    return {
      id: result.id,
      status: result.status,
    };
  }

  async onCreated(data: OrderCreatedEventPayload) {
    await this.repository.create(data.order);
  }

  async onUpdated(data: OrderUpdatedEventPayload) {
    const result = await this.repository.update(data.order.id, {
      status: data.order.status,
    });
    console.log('Updated order', result);
  }
}
