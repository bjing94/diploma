import { Inject, Injectable } from '@nestjs/common';
import ProductAbstractRepository from './repository/product.abstract-repository';
import {
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventStoreService } from '@burger-shop/event-store';

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    private readonly eventStoreService: EventStoreService
  ) {}

  public async getById(id: number): Promise<ProductGetByIdQueryResponse> {
    const product = await this.productRepository.find(id);
    return {
      product,
    };
  }

  public async find(
    dto: ProductFindQueryRequest
  ): Promise<ProductFindQueryResponse> {
    const products = await this.productRepository.findMany(dto.take, dto.skip);
    return {
      products: products,
    };
  }

  public async onCreated(dto: ProductCreatedEventPayload): Promise<void> {
    const { price, name } = dto.product;
    const id = await this.productRepository.getNextId();
    await this.productRepository.create({ id, price, name });
  }

  public async onDeleted(dto: ProductDeletedEventPayload): Promise<void> {
    await this.productRepository.delete(dto.id);
  }

  public async onUpdated(dto: ProductUpdatedEventPayload): Promise<void> {
    const { product } = dto;
    await this.productRepository.update(product.id, product);
  }

  // public async getMenu(){

  // }

  // public async onMenuCreated(dto:ProductCreated.Payload){

  // }
}
