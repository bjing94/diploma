import {
  CookingRequestCreateCommandRequest,
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
} from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { READ_CONNECTION_NAME } from '../../config/mongoose.config';
import {
  CookingRequestDocument,
  CookingRequestModel,
} from '../model/cooking-request.model';

export default class CookingRequestRepository {
  constructor(
    @InjectModel(CookingRequestModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<CookingRequestDocument>
  ) {}

  public async findOne(filter: FilterQuery<CookingRequestModel>) {
    return this.model.findOne(filter);
  }

  public async findMany(filter: FilterQuery<CookingRequestModel>) {
    return this.model.find(filter);
  }

  public async create(data: CookingRequestCreatedEventPayload) {
    return this.model.create({
      _id: new Types.ObjectId(data.id),
      productId: data.productId,
      status: data.status,
    });
  }

  public async update(data: CookingRequestUpdatedEventPayload) {
    return this.model.findByIdAndUpdate(data.id, {
      productId: data.productId,
      status: data.status,
    });
  }
}
