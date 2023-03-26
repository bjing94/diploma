import {
  OrderCreatedEventPayload,
  OrderFindQueryRequest,
  OrderFindQueryResponse,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdatedEventPayload,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { OrderStatus, PaymentStatus } from '@burger-shop/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import OrderRepository from '../infrastructure/database/mongo/repository/order.repository';
import OrderAbstractRepository from './repository/order.abstract-repository';

@Injectable()
export default class OrderQueryService {
  constructor(
    @Inject('OrderRepository')
    private readonly repository: OrderRepository
  ) {}

  async getOrder(data: OrderGetQueryRequest): Promise<OrderGetQueryResponse> {
    const result = await this.repository.find({ _id: data.id });
    if (!result) return null;
    return {
      id: result.id,
      status: result.status,
    };
  }

  async findOrders(
    data: OrderFindQueryRequest
  ): Promise<OrderFindQueryResponse> {
    const result = await this.repository.findMany({
      status: data.status,
    });
    if (!result.length) return { orders: [] };
    return {
      orders: result.map((res) => {
        return { id: res.id, status: res.status };
      }),
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
