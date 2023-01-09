import { Model } from 'mongoose';
import { OrderStatus } from '@burger-shop/interfaces';
import { CreateOrderSagaDocument } from '../model/create-order-saga.model';

export default class CreateOrderSagaRepository {
  private sagaModel: Model<CreateOrderSagaDocument>;

  constructor(repository: Model<CreateOrderSagaDocument>) {
    this.sagaModel = repository;
  }

  public async createSaga(orderId: string) {
    const newSaga = new this.sagaModel({
      orderId,
      status: OrderStatus.CREATED,
    });
    return newSaga.save();
  }

  public async updateSaga(orderId: string, status: OrderStatus) {
    await this.sagaModel.updateOne({ orderId: orderId }, { status });
  }

  public async getSaga(orderId: string) {
    return this.sagaModel.findOne({ orderId: orderId });
  }
}
