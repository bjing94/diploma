import ProductDomainEntity from '../../domain/entity/food.domain-entity';
import { Product } from '../../infrastructure/database/mongo/model/product.model';

export default class ProductMapper {
  public static toModel(domainEntity: ProductDomainEntity): Product {
    const product = new Product();
    product.id = domainEntity.id;
    product.name = domainEntity.name;
    product.price = domainEntity.price;
    return product;
  }

  public static toDomainEntity(model: Product): ProductDomainEntity {
    return new ProductDomainEntity({
      price: model.price,
      name: model.name,
      id: model.id,
    });
  }

  public static toDomainEntityMany(models: Product[]): ProductDomainEntity[] {
    const products = [];
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      products.push(
        new ProductDomainEntity({
          price: model.price,
          name: model.name,
          id: model.id,
        })
      );
    }
    return products;
  }
}
