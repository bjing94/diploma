import { Order } from '../../infrastructure/database/mongo/model/order.model';

export default abstract class OrderAbstractRepository {
  public abstract find(id: string): Promise<Order>;
  public abstract create(order: Order): Promise<Order>;
  public abstract update(id: string, order: Order): Promise<Order>;
  public abstract delete(id: string): Promise<void>;
}
