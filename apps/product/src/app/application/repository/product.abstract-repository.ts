import { Product, ProductDocument } from '@burger-shop/models';
import ProductCreateDto from '../../interfaces/product.create.dto';
import ProductUpdateDto from '../../interfaces/product.update.dto';

export default abstract class ProductAbstractRepository {
  public abstract find(id: number): Promise<ProductDocument>;
  public abstract findMany(take: number, skip: number): Promise<Product[]>;
  public abstract create(product: ProductCreateDto): Promise<Product>;
  public abstract update(
    id: number,
    product: ProductUpdateDto
  ): Promise<Product>;
  public abstract delete(id: number): Promise<void>;
  public abstract getNextId(): Promise<number>;
}
