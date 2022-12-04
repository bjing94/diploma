import { Product } from '../../infrastructure/database/mongo/model/product.model';

// Доступ к копии данных хранящихся в БД сервиса Order
export default abstract class ProductAbstractRepository {
  public abstract find(id: string): Promise<Product>;
  public abstract findMany(ids: string[]): Promise<Product[]>;
  public abstract create(order: Product): Promise<Product>;
  public abstract update(id: string, order: Product): Promise<Product>;
  public abstract delete(id: string): Promise<void>;
}
