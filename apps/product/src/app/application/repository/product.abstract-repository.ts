import { Product } from '../../infrastructure/database/model/product.model';

export default abstract class ProductAbstractRepository {
  public abstract find(id: number): Promise<Product>;
  public abstract findMany(take: number, skip: number): Promise<Product[]>;
  public abstract create(order: Product): Promise<Product>;
  public abstract update(id: number, order: Product): Promise<Product>;
  public abstract delete(id: number): Promise<void>;
}
