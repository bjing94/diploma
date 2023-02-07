import { Product, ProductDocument } from '@burger-shop/models';
import ProductCreateDto from '../../interfaces/product.create.dto';
import ProductUpdateDto from '../../interfaces/product.update.dto';

export default abstract class ProductAbstractRepository {
  public abstract find(id: string): Promise<ProductDocument>;
  public abstract findMany(
    take: number,
    skip: number
  ): Promise<ProductDocument[]>;
  public abstract create(product: ProductCreateDto): Promise<ProductDocument>;
  public abstract update(
    id: string,
    product: ProductUpdateDto
  ): Promise<ProductDocument>;
  public abstract delete(id: string): Promise<void>;
  public abstract getNextId(): Promise<number>;
}
