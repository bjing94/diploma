import {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { EventStoreService } from '@burger-shop/event-store';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { Inject, Injectable } from '@nestjs/common';
import MenuRepositoryProvider from './provider/menu.repository-provider';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly menuRepoProvider: MenuRepositoryProvider,
    private readonly eventStoreService: EventStoreService
  ) {}

  public async create(
    dto: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    const domain = new ProductDomainEntity(dto.name, dto.price);
    await this.kafkaProducerService.emitProductCreated({
      product: {
        name: domain.name,
        price: domain.price,
      },
    });
    await this.eventStoreService.saveEvent({
      name: EventTopics.productCreated,
      payload: JSON.stringify({
        product: {
          name: domain.name,
          price: domain.price,
        },
      }),
    });
    return {
      succes: true,
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
    await this.eventStoreService.saveEvent({
      name: EventTopics.productUpdated,
      payload: JSON.stringify({
        product: {
          id,
          name,
          price,
        },
      }),
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
    await this.eventStoreService.saveEvent({
      name: EventTopics.productDeleted,
      payload: JSON.stringify({
        id,
      }),
    });
    return { success: true };
  }
}
