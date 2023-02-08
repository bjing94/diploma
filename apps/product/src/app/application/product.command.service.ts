import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
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
import { Product, ProductDocument } from '@burger-shop/models';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import MenuItemDomainEntity from '../domain/menu-item.domain-entity';
import MenuDomainEntity from '../domain/menu.domain-entity';
import MenuRepositoryProvider from './provider/menu.repository-provider';
import MenuAbstractRepository from './repository/menu.abstract-repository';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('MenuRepository')
    private readonly menuRepository: MenuAbstractRepository,
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
        id: domain.id,
      },
    });
    await this.eventStoreService.saveEvent({
      name: EventTopics.productCreated,
      payload: JSON.stringify({
        product: {
          name: domain.name,
          price: domain.price,
          id: domain.id,
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

  public async createMenu(
    dto: MenuCreateCommandRequest
  ): Promise<MenuCreateCommandResponse> {
    const { items } = dto;
    const productsMap = new Map<string, ProductDocument>();
    for (const item of items) {
      const product = await this.productRepository.find(item.productId);
      if (!product) {
        return { success: false };
      }
      productsMap.set(item.productId, product);
    }

    const menuItems = items.map((item, idx) => {
      const product = productsMap.get(item.productId);
      return new MenuItemDomainEntity(
        new ProductDomainEntity(product.name, product.price, product.id),
        item.available,
        item.price,
        idx
      );
    });
    const menuDomain = new MenuDomainEntity(menuItems);
    console.log(menuDomain);
    const payload = {
      menu: {
        items: menuDomain.items.map((item) => ({
          available: item.available,
          price: item.price,
          product: { _id: item.product.id },
        })),
        id: menuDomain.id,
      },
    };
    await this.kafkaProducerService.emitMenuCreated(payload);
    await this.eventStoreService.saveEvent({
      name: EventTopics.menuCreated,
      payload: JSON.stringify(payload),
    });
    return {
      success: true,
      id: menuDomain.id,
    };
  }
}
