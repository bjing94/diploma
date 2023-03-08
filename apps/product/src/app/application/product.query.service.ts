import { Inject, Injectable } from '@nestjs/common';
import ProductAbstractRepository from './repository/product.abstract-repository';
import {
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

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('MenuRepository')
    private readonly menuRepository: MenuAbstractRepository
  ) {}

  public async getById(id: string): Promise<ProductGetByIdQueryResponse> {
    const product = await this.productRepository.find(id);

    return {
      product,
    };
  }

  public async getItemFromMenu(
    id: string
  ): Promise<ProductGetMenuItemQueryResponse> {
    const mainMenu = await this.menuRepository.getActiveMenu();
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
    console.log(products);
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
    await this.productRepository.create({ id, price, name });
  }

  public async onDeleted(dto: ProductDeletedEventPayload): Promise<void> {
    await this.productRepository.deactivate(dto.id);
  }

  public async onUpdated(dto: ProductUpdatedEventPayload): Promise<void> {
    const { product } = dto;
    await this.productRepository.update(product.id, product);
  }

  public async onMenuCreated(dto: MenuCreatedEventPayload): Promise<void> {
    const { menu } = dto;
    await this.menuRepository.create({
      id: menu.id,
      items: menu.items.map((item, idx) => {
        return { ...item, id: idx };
      }),
      active: menu.active,
    });
  }

  public async onMenuUpdated(dto: MenuUpdatedEventPayload): Promise<void> {
    const { menu } = dto;
    await this.menuRepository.update(menu.id, {
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
}
