import { Model } from 'mongoose';
import PaymentAbstractRepository from '../../../application/repository/payment.abstract-repository';
import PaymentModel, { PaymentDocument } from '../model/payment.model';

export default class PaymentRepository implements PaymentAbstractRepository {
  private _repository: Model<PaymentDocument>;

  constructor(repository: Model<PaymentDocument>) {
    this._repository = repository;
  }

  public async find(id: string): Promise<PaymentDocument> {
    const payment = await this._repository.findById(id).exec();
    return payment;
  }

  public async create(payment: PaymentModel): Promise<PaymentDocument> {
    return this._repository.create(payment);
  }

  public async update(
    id: string,
    payment: PaymentModel
  ): Promise<PaymentDocument> {
    return this._repository.findByIdAndUpdate(id, payment);
  }

  public async delete(id: string): Promise<void> {
    await this._repository.findByIdAndDelete(id);
  }
}
