import {
  CookingStockCreatedEventPayload,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { READ_CONNECTION_NAME } from '../../config/mongoose.config';
import {
  CookingStockModel,
  CookingStockDocument,
} from '../model/cooking-stock.model';

export default class CookingStockRepository {
  constructor(
    @InjectModel(CookingStockModel.name, READ_CONNECTION_NAME)
    private readonly model: Model<CookingStockDocument>
  ) {}

  public async findOne(filter: FilterQuery<CookingStockModel>) {
    return this.model.findOne(filter);
  }

  public async findMany(filter: FilterQuery<CookingStockModel>) {
    return this.model.find(filter);
  }

  public async create(data: CookingStockCreatedEventPayload) {
    return this.model.create({
      _id: new Types.ObjectId(data.id),
      productId: data.productId,
      quantity: data.quantity,
    });
  }

  public async update(data: CookingStockUpdatedEventPayload) {
    return this.model.findByIdAndUpdate(data.id, {
      quantity: data.quantity,
    });
  }
}
