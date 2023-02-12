import { OrderCreatedDto } from '@burger-shop/contracts';
import {
  OrderModel,
  OrderDocument,
} from '../../infrastructure/database/mongo/model/order.model';

export default abstract class OrderAbstractRepository {
  public abstract find(id: string): Promise<OrderDocument>;
  public abstract create(order: OrderCreatedDto): Promise<OrderDocument>;
  public abstract update(
    id: string,
    order: Partial<OrderModel>
  ): Promise<OrderDocument>;
  public abstract delete(id: string): Promise<void>;
}
