import { Model } from 'mongoose';
import PaymentAbstractRepository from '../../../application/repository/payment.repository';
import PaymentModel, { PaymentDocument } from '../model/payment.model';

export default class PaymentRepository implements PaymentAbstractRepository {
  private _repository: Model<PaymentDocument>;

  constructor(repository: Model<PaymentDocument>) {
    this._repository = repository;
  }

  public async find(id: number): Promise<PaymentModel> {
    const payment = await this._repository.findOne({ id: id }).exec();
    return payment;
  }

  public async create(payment: PaymentModel): Promise<PaymentModel> {
    return this._repository.create(payment);
  }

  public async update(
    id: number,
    payment: PaymentModel
  ): Promise<PaymentModel> {
    return this._repository.findOneAndUpdate({ id }, payment);
  }

  public async delete(id: string): Promise<void> {
    await this._repository.findOneAndDelete({ id });
  }
}
