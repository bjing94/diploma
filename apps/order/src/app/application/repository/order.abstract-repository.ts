import { OrderCreatedDto } from '@burger-shop/contracts';
import { FilterQuery } from 'mongoose';
import {
  OrderModel,
  OrderDocument,
} from '../../infrastructure/database/mongo/model/order.model';

export default abstract class OrderAbstractRepository {
  public abstract find(
    model: FilterQuery<OrderDocument>
  ): Promise<OrderDocument>;
  public abstract create(order: OrderCreatedDto): Promise<OrderDocument>;
  public abstract update(
    id: string,
    order: Partial<OrderModel>
  ): Promise<OrderDocument>;
  public abstract delete(id: string): Promise<void>;
}
