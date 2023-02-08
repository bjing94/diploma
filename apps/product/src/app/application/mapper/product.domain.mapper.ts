import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { Product, ProductDocument } from '@burger-shop/models';

export default class ProductDomainMapper {
  public static toDatabase(product: ProductDomainEntity): Product {
    return {
      name: product.name,
      price: product.price,
    };
  }
  public static toDomain(product: ProductDocument): ProductDomainEntity {
    const domain = new ProductDomainEntity(
      product.name,
      product.price,
      product.id
    );
    return domain;
  }
}
