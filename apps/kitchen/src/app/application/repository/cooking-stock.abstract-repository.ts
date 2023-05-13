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

export default abstract class CookingStockAbstractRepository {
  public abstract findOne(
    filter: FilterQuery<CookingStockModel>
  ): Promise<CookingStockDocument>;

  public abstract findMany(
    filter: FilterQuery<CookingStockModel>
  ): Promise<CookingStockDocument[]>;

  public abstract create(
    data: CookingStockCreatedEventPayload
  ): Promise<CookingStockDocument>;

  public abstract update(
    data: CookingStockUpdatedEventPayload
  ): Promise<CookingStockDocument>;

  public abstract clearAll(): Promise<void>;
}
