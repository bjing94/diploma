import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PaymentModel, {
  PaymentDocument,
} from '../../infrastructure/database/model/payment.model';
import PaymentRepository from '../../infrastructure/database/repository/payment.repository';
import PaymentAbstractRepository from '../repository/payment.repository';

@Injectable()
export default class PaymentRepositoryProvider {
  public repository: PaymentAbstractRepository;

  constructor(
    @InjectModel(PaymentModel.name)
    private readonly paymentModel: Model<PaymentDocument>
  ) {}

  onApplicationBootstrap() {
    this.repository = new PaymentRepository(this.paymentModel);
  }
}
