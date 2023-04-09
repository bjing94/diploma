import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import {
  MenuDomainEntity,
  MenuItemDomainEntity,
  ProductDomainEntity,
} from '@burger-shop/domain-entity';
import { EventStoreProductService } from '@burger-shop/event-store';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { ProductDocument } from '@burger-shop/models';
import { Inject, Injectable } from '@nestjs/common';
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
    private readonly eventStoreService: EventStoreProductService
  ) {}

  public async create(
    dto: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    const domain = new ProductDomainEntity(dto.name);
    const payload = {
      product: {
        name: domain.name,
        id: domain.id,
      },
    };
    await this.kafkaProducerService.emitProductCreated(payload);
    await this.eventStoreService.saveProductEvent({
      objectId: domain.id,
      name: EventTopics.productCreated,
      payload: JSON.stringify(payload),
    });
    return {
      succes: true,
    };
  }

  public async update(
    dto: ProductUpdateRequest
  ): Promise<ProductUpdateResponse> {
    const { id, name, price } = dto;
    const product = await this.eventStoreService.getProduct(id);
    if (!product) return { success: false };

    const payload = {
      product: {
        id,
        name,
        price,
      },
    };
    await this.kafkaProducerService.emitProductUpdated(payload);
    await this.eventStoreService.saveProductEvent({
      objectId: id,
      name: EventTopics.productUpdated,
      payload: JSON.stringify(payload),
    });
    return { success: true };
  }

  public async delete(
    dto: ProductDeleteRequest
  ): Promise<ProductDeleteResponse> {
    const { id } = dto;
    const product = await this.eventStoreService.getProduct(id);
    if (!product) return { success: false };
    const payload = { id };
    await this.kafkaProducerService.emitProductDeleted(payload);
    await this.eventStoreService.saveProductEvent({
      objectId: id,
      name: EventTopics.productDeleted,
      payload: JSON.stringify(payload),
    });
    return { success: true };
  }

  public async createMenu(
    dto: MenuCreateCommandRequest
  ): Promise<MenuCreateCommandResponse> {
    const { items } = dto;
    const productsMap = new Map<string, ProductDocument>();
    const menu = await this.menuRepository.findOne({ active: true });
    if (menu) return null;
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
        product.id,
        item.available,
        item.price,
        idx
      );
    });
    const menuDomain = new MenuDomainEntity(menuItems, null, true);
    const payload = {
      menu: {
        items: menuDomain.items.map((item, idx) => ({
          available: item.available,
          price: item.price,
          productId: item.productId,
          id: idx,
        })),
        id: menuDomain.id,
        active: menuDomain.active,
      },
    };
    await this.kafkaProducerService.emitMenuCreated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: menuDomain.id,
      name: EventTopics.menuCreated,
      payload: JSON.stringify(payload),
    });

    return {
      success: true,
      id: menuDomain.id,
    };
  }

  public async updateMenu(
    dto: MenuUpdateCommandRequest
  ): Promise<MenuUpdateCommandResponse> {
    const { id, data } = dto;
    const { items, active } = data;
    const menu = await this.menuRepository.get(id);
    if (!menu) return { success: false };

    const productsMap = new Map<string, ProductDocument>();
    for (const item of items) {
      const product = await this.productRepository.find(item.productId);
      if (!product) {
        return { success: false };
      }
      productsMap.set(item.productId, product);
    }

    const menuItems = items.map((item, idx) => {
      return new MenuItemDomainEntity(
        item.productId,
        item.available,
        item.price,
        idx
      );
    });
    const menuDomain = new MenuDomainEntity(menuItems, menu.id, active);
    const payload = {
      menu: {
        items: menuDomain.items.map((item, idx) => ({
          available: item.available,
          price: item.price,
          productId: item.productId,
          id: idx,
        })),
        id: menuDomain.id,
        active: menuDomain.active,
      },
    };
    await this.kafkaProducerService.emitMenuUpdated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: menuDomain.id,
      name: EventTopics.menuUpdated,
      payload: JSON.stringify(payload),
    });
    return {
      success: true,
    };
  }

  async productClearRead() {
    await this.productRepository.clearAll();
  }

  async menuClearRead() {
    await this.menuRepository.clearAll();
  }
}
