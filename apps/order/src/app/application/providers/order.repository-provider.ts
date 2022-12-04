import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
} from '../../infrastructure/database/mongo/model/order.model';
import OrderRepository from '../../infrastructure/database/mongo/repository/order.repository';
import OrderAbstractRepository from '../repository/order.abstract-repository';

@Injectable()
export default class OrderRepositoryProvider {
  public repository: OrderAbstractRepository;

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new OrderRepository(this.orderModel);
  }
}
