import { OrderCreatedDto } from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import OrderAbstractRepository from '../../../../application/repository/order.abstract-repository';
import { READ_CONNECTION_NAME } from '../../../../config/mongoose.config';
import { OrderModel, OrderDocument } from '../model/order.model';

export default class OrderRepository implements OrderAbstractRepository {
  constructor(
    @InjectModel(OrderModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<OrderDocument>
  ) {}
  public async find(model: FilterQuery<OrderDocument>): Promise<OrderDocument> {
    return this.model.findOne(model);
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
    return this.model.findByIdAndUpdate(id, order).exec();
  }
  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
