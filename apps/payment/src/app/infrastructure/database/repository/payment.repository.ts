import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import PaymentAbstractRepository from '../../../application/repository/payment.abstract-repository';
import { READ_CONNECTION_NAME } from '../../../config/mongoose.config';
import PaymentModel, { PaymentDocument } from '../model/payment.model';

export default class PaymentRepository implements PaymentAbstractRepository {
  constructor(
    @InjectModel(PaymentModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<PaymentDocument>
  ) {}

  public async find(id: string): Promise<PaymentDocument> {
    const payment = await this.model.findById(id).exec();
    return payment;
  }

  public async create(payment: PaymentModel): Promise<PaymentDocument> {
    const { _id, ...rest } = payment;
    return this.model.create({
      ...rest,
      _id: new Types.ObjectId(_id),
    });
  }

  public async update(
    id: string,
    payment: PaymentModel
  ): Promise<PaymentDocument> {
    return this.model.findByIdAndUpdate(id, payment);
  }

  public async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
