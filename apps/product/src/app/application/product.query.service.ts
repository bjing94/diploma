import { Inject, Injectable } from '@nestjs/common';
import ProductAbstractRepository from './repository/product.abstract-repository';
import {
  MenuCreateCommandRequest,
  MenuCreatedEventPayload,
  MenuGetQueryRequest,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventStoreService } from '@burger-shop/event-store';
import MenuAbstractRepository from './repository/menu.abstract-repository';

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('MenuRepository')
    private readonly menuRepository: MenuAbstractRepository,
    private readonly eventStoreService: EventStoreService
  ) {}

  public async getById(id: string): Promise<ProductGetByIdQueryResponse> {
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
      products,
    };
  }

  public async onCreated(dto: ProductCreatedEventPayload): Promise<void> {
    const { price, name, id } = dto.product;
    const result = await this.productRepository.create({ id, price, name });
    console.log(result);
  }

  public async onDeleted(dto: ProductDeletedEventPayload): Promise<void> {
    await this.productRepository.delete(dto.id);
  }

  public async onUpdated(dto: ProductUpdatedEventPayload): Promise<void> {
    const { product } = dto;
    await this.productRepository.update(product.id, product);
  }

  public async onMenuCreated(dto: MenuCreatedEventPayload): Promise<void> {
    const { menu } = dto;
    const result = await this.menuRepository.create({
      id: menu.id,
      items: menu.items.map((item, idx) => {
        return { ...item, id: idx };
      }),
    });
    console.log(result);
  }

  public async getMenu(dto: MenuGetQueryRequest) {
    const result = await this.menuRepository.find(dto.id);
    console.log(result);
    return result;
  }
}
