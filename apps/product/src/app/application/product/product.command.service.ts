import { ProductCreate } from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { Injectable } from '@nestjs/common';
import ProductDomainMapper from '../mapper/product.domain.mapper';
import ProductRepositoryProvider from '../provider/product.repository-provider';
import ProductAbstractRepository from '../repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  private productRepo: ProductAbstractRepository;
  constructor(productRepoProvider: ProductRepositoryProvider) {
    this.productRepo = productRepoProvider.repository;
  }

  public async create(
    dto: ProductCreate.Request
  ): Promise<ProductCreate.Response> {
    const domain = new ProductDomainEntity(dto.name, dto.price);
    const db = ProductDomainMapper.toDatabase(domain);

    return {
      product: domain,
    };
  }
}
