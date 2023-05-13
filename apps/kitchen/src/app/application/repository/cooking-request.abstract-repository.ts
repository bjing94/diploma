import {
  CookingRequestCreateCommandRequest,
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { READ_CONNECTION_NAME } from '../../config/mongoose.config';
import {
  CookingRequestDocument,
  CookingRequestModel,
} from '../model/cooking-request.model';

export default abstract class CookingRequestAbstractRepository {
  public abstract findOne(
    filter: FilterQuery<CookingRequestModel>
  ): Promise<CookingRequestDocument>;

  public abstract findMany(
    filter: FilterQuery<CookingRequestModel>
  ): Promise<CookingRequestDocument[]>;

  public abstract create(
    data: CookingRequestCreatedEventPayload
  ): Promise<CookingRequestDocument>;

  public abstract update(
    data: CookingRequestUpdatedEventPayload
  ): Promise<CookingRequestDocument>;

  public abstract clearAll(): Promise<void>;
}
