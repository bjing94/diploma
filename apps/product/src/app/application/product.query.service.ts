import {
  ProductCreated,
  ProductDeleted,
  ProductFind,
  ProductGetById,
  ProductUpdated,
} from '@burger-shop/contracts';
import { Injectable } from '@nestjs/common';
import { Product } from '@burger-shop/models';
import ProductRepositoryProvider from './provider/product.repository-provider';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductQueryService {
  private productRepo: ProductAbstractRepository;
  constructor(private readonly productRepoProvider: ProductRepositoryProvider) {
    this.productRepo = productRepoProvider.repository;
  }

  public async getById(id: number): Promise<ProductGetById.Response> {
    const product = await this.productRepo.find(id);
    return {
      product,
    };
  }

  public async find(dto: ProductFind.Request): Promise<ProductFind.Response> {
    const products = await this.productRepo.findMany(dto.take, dto.skip);
    return {
      products: products,
    };
  }

  public async onCreated(dto: ProductCreated.Payload): Promise<void> {
    console.log(this.productRepo);
    const product = new Product(dto.product);
    await this.productRepoProvider.repository.create(product);
  }

  public async onDeleted(dto: ProductDeleted.Payload): Promise<void> {
    await this.productRepo.delete(dto.id);
  }

  public async onUpdated(dto: ProductUpdated.Payload): Promise<void> {
    const product = new Product(dto.product);
    await this.productRepo.update(product.id, product);
  }
}
