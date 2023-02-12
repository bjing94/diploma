import { OrderCreatedDto } from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import OrderAbstractRepository from '../../../../application/repository/order.abstract-repository';
import { READ_CONNECTION_NAME } from '../../../../config/mongoose.config';
import { OrderModel, OrderDocument } from '../model/order.model';

export default class OrderRepository implements OrderAbstractRepository {
  constructor(
    @InjectModel(OrderModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<OrderDocument>
  ) {}
  public async find(id: string): Promise<OrderDocument> {
    return this.model.findById(id).exec();
  }
  public async create(order: OrderCreatedDto): Promise<OrderDocument> {
    const { id, status, ...rest } = order;
    return this.model.create({
      _id: id,
      status: order.status,
      orderItems: order.orderItems,
      paymentId: order.paymentId,
    });
  }
  public async update(
    id: string,
    order: Partial<OrderModel>
  ): Promise<OrderDocument> {
    return this.model.findOneAndUpdate({ id }, order).exec();
  }
  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
