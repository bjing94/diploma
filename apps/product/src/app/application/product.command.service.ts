import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductCreatedEventPayload,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import {
  MenuDomainEntity,
  MenuItemDomainEntity,
  ProductDomainEntity,
} from '@burger-shop/domain-entity';
import {
  EventStoreProductService,
  MenuEventNames,
  ProductEventNames,
} from '@burger-shop/event-store';
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
    const domain = new ProductDomainEntity(dto.name, null, dto.imgLink);
    const payload: ProductCreatedEventPayload = {
      product: {
        name: domain.name,
        id: domain.id,
        imgLink: domain.imgLink,
      },
      eventName: ProductEventNames.productCreated,
    };
    await this.kafkaProducerService.emitProductCreated(payload);
    await this.eventStoreService.saveProductEvent({
      objectId: domain.id,
      name: ProductEventNames.productCreated,
      payload: JSON.stringify(payload),
    });
    return {
      succes: true,
    };
  }

  public async update(
    dto: ProductUpdateRequest
  ): Promise<ProductUpdateResponse> {
    const { id, name, imgLink } = dto;
    const product = await this.eventStoreService.getProduct(id);
    if (!product) return { success: false };

    const payload: ProductUpdatedEventPayload = {
      product: {
        id,
        name,
        imgLink,
      },
      eventName: ProductEventNames.productUpdated,
    };
    await this.kafkaProducerService.emitProductUpdated(payload);
    await this.eventStoreService.saveProductEvent({
      objectId: id,
      name: ProductEventNames.productUpdated,
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
    const payload = { id, eventName: ProductEventNames.productUpdated };
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
      eventName: MenuEventNames.menuCreated,
    };
    await this.kafkaProducerService.emitMenuCreated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: menuDomain.id,
      name: MenuEventNames.menuCreated,
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

    if (menu.active !== active) {
      if (menu.active === false) {
        await this.deactivateMenu(dto);
      } else {
        await this.activateMenu(dto);
      }
    }

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
      },
      eventName: MenuEventNames.menuItemsUpdated,
    };
    await this.kafkaProducerService.emitMenuUpdated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: menuDomain.id,
      name: MenuEventNames.menuItemsUpdated,
      payload: JSON.stringify(payload),
    });
    return {
      success: true,
    };
  }

  public async activateMenu(dto: MenuUpdateCommandRequest) {
    const { id } = dto;
    const menu = await this.menuRepository.get(id);
    if (!menu) return { success: false };

    const payload = {
      menu: {
        active: true,
        id: id,
      },
      eventName: MenuEventNames.menuActivated,
    };
    await this.kafkaProducerService.emitMenuUpdated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: id,
      name: MenuEventNames.menuActivated,
      payload: JSON.stringify(payload),
    });
    return {
      success: true,
    };
  }

  public async deactivateMenu(dto: MenuUpdateCommandRequest) {
    const { id } = dto;
    const menu = await this.menuRepository.get(id);
    if (!menu) return { success: false };

    const payload = {
      menu: {
        active: false,
        id: id,
      },
      eventName: MenuEventNames.menuDeactivated,
    };
    await this.kafkaProducerService.emitMenuUpdated(payload);
    await this.eventStoreService.saveMenuEvent({
      objectId: id,
      name: MenuEventNames.menuDeactivated,
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
