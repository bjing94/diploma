import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { Product } from '../../../../../../libs/models/src/lib/product.model';

export default class ProductDomainMapper {
  public static toDatabase(product: ProductDomainEntity): Product {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
  public static toDomain(product: Product): ProductDomainEntity {
    const domain = new ProductDomainEntity(
      product.name,
      product.price,
      product.id
    );
    return domain;
  }
}
