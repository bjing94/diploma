import { Inject, Injectable } from '@nestjs/common';
import { Product } from '@burger-shop/models';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository
  ) {}

  // public async getById(id: number): Promise<ProductGetById.Response> {
  //   const product = await this.productRepository.find(id);
  //   return {
  //     product,
  //   };
  // }

  // public async find(dto: ProductFind.Request): Promise<ProductFind.Response> {
  //   const products = await this.productRepository.findMany(dto.take, dto.skip);
  //   return {
  //     products: products,
  //   };
  // }

  // public async onCreated(dto: ProductCreated.Payload): Promise<void> {
  //   const product = new Product(dto.product);
  //   await this.productRepository.create(product);
  // }

  // public async onDeleted(dto: ProductDeleted.Payload): Promise<void> {
  //   await this.productRepository.delete(dto.id);
  // }

  // public async onUpdated(dto: ProductUpdated.Payload): Promise<void> {
  //   const product = new Product(dto.product);
  //   await this.productRepository.update(product.id, product);
  // }

  // public async getMenu(){

  // }

  // public async onMenuCreated(dto:ProductCreated.Payload){

  // }
}
