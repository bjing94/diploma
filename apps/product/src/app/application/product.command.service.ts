import {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { MenuItemCreateRequestDto } from '@burger-shop/interfaces';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Inject, Injectable } from '@nestjs/common';
import MenuItemDomainEntity from '../domain/menu-item.domain-entity';
import MenuDomainEntity from '../domain/menu.domain-entity';
import MenuDomainMapper from './mapper/menu.domain.mapper';
import ProductDomainMapper from './mapper/product.domain.mapper';
import MenuRepositoryProvider from './provider/menu.repository-provider';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly menuRepoProvider: MenuRepositoryProvider
  ) {}

  public async create(
    dto: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    const domain = new ProductDomainEntity(dto.name, dto.price);

    await this.kafkaProducerService.emitProductCreated({
      product: {
        id: domain.id,
        name: domain.name,
        price: domain.price,
      },
    });
    return {
      product: {
        id: domain.id,
        name: domain.name,
        price: domain.price,
      },
    };
  }

  public async update(
    dto: ProductUpdateRequest
  ): Promise<ProductUpdateResponse> {
    const { id, name, price } = dto;
    const product = await this.productRepository.find(id);
    if (!product) return { success: false };

    await this.kafkaProducerService.emitProductUpdated({
      product: {
        id,
        name,
        price,
      },
    });
    return { success: true };
  }

  public async delete(
    dto: ProductDeleteRequest
  ): Promise<ProductDeleteResponse> {
    const { id } = dto;
    const product = await this.productRepository.find(id);
    if (!product) return { success: false };

    await this.kafkaProducerService.emitProductDeleted({
      id,
    });
    return { success: true };
  }
}
