import { Inject, Injectable, Logger } from '@nestjs/common';
import ProductAbstractRepository from './repository/product.abstract-repository';
import {
  MenuCreateCommandRequest,
  MenuCreatedEventPayload,
  MenuFindQueryRequest,
  MenuFindQueryResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  MenuUpdatedEventPayload,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryResponse,
  ProductGetMenuItemQueryResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import MenuAbstractRepository from './repository/menu.abstract-repository';
import { EventStoreProductService, ISaveEvent } from '@burger-shop/event-store';
import { ProductDomainEntity } from '../domain/product.domain-entity';
import { EventTopics } from '@burger-shop/kafka-module';

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('MenuRepository')
    private readonly menuRepository: MenuAbstractRepository,
    private readonly eventStoreProductService: EventStoreProductService
  ) {}

  public async getById(id: string): Promise<ProductGetByIdQueryResponse> {
    const snapshotProduct = await this.productRepository.find(id);

    if (snapshotProduct) {
      const eventStream =
        await this.eventStoreProductService.getProductEventStream(
          id,
          snapshotProduct.updatedAt
        );
      const product = new ProductDomainEntity(
        snapshotProduct.name,
        snapshotProduct.price,
        snapshotProduct.id
      );
      product.applyEvents(eventStream);
      return {
        product,
      };
    } else {
      const eventStream =
        await this.eventStoreProductService.getProductEventStream(id);
      const product = ProductDomainEntity.hydrate(eventStream);
      return {
        product,
      };
    }
  }

  public async getItemFromMenu(
    id: string
  ): Promise<ProductGetMenuItemQueryResponse> {
    const mainMenu = await this.menuRepository.getActiveMenu();
    Logger.log(`Got menu ${mainMenu}`);
    if (!mainMenu) return null;
    const item = mainMenu.items.find((item) => item.id === id);
    if (!item) return null;
    const { product, ...rest } = item;
    return {
      product: {
        id: item.id,
        available: item.available,
        price: item.price,
        product: {
          id: product.id,
          price: product.price,
          name: product.name,
        },
      },
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

  public async findMenu(
    dto: MenuFindQueryRequest
  ): Promise<MenuFindQueryResponse> {
    const menus = await this.menuRepository.findMany(dto);
    return {
      menus,
    };
  }

  public async onCreated(dto: ProductCreatedEventPayload): Promise<void> {
    const { price, name, id } = dto.product;
    const result = await this.productRepository.create({ id, price, name });
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
      active: menu.active,
    });
  }

  public async onMenuUpdated(dto: MenuUpdatedEventPayload): Promise<void> {
    const { menu } = dto;
    const result = await this.menuRepository.update(menu.id, {
      items: menu.items.map((item, idx) => {
        return { ...item, id: idx };
      }),
      active: menu.active,
    });
  }

  public async getMenu(
    dto: MenuGetQueryRequest
  ): Promise<MenuGetQueryResponse> {
    const result = await this.menuRepository.get(dto.id);

    return { menu: result };
  }

  private async makeSnapshot() {
    const products = await this.productRepository.findMany(1, 0);
    let minDate = null;
    if (products.length > 0) {
      minDate = products[0].updatedAt;
    }
    console.log(minDate);
    const events = await this.eventStoreProductService.getProductEvents(
      minDate
    );
    // const events = await this.eventStoreProductService.getProductEvents();
    console.log('Events for snapshot', events);
    for (const event of events) {
      await this.applyEventToSnapshot(event);
    }
    Logger.log(`Snapshot created at ${new Date()}`);
  }

  private async applyEventToSnapshot(event: ISaveEvent) {
    if (event.name === EventTopics.productCreated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductCreatedEventPayload;
      const { id, name, price } = product;
      await this.productRepository.create({
        id,
        name,
        price,
      });
    }
  }
}
