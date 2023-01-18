import { Model } from 'mongoose';
import OrderAbstractRepository from '../../../../application/repository/order.abstract-repository';
import { Order, OrderDocument } from '../model/order.model';

export default class OrderRepository implements OrderAbstractRepository {
  private _repository: Model<OrderDocument>;

  constructor(repository: Model<OrderDocument>) {
    this._repository = repository;
  }
  public async find(id: string): Promise<Order> {
    return this._repository.findOne({ id: id }).exec();
  }
  public async create(order: Order): Promise<Order> {
    return this._repository.create(order);
  }
  public async update(id: string, order: Order): Promise<Order> {
    return this._repository.findOneAndUpdate({ id }, order).exec();
  }
  public async delete(id: string): Promise<void> {
    await this._repository.findByIdAndDelete(id).exec();
  }
}
