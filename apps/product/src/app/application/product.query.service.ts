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
import {
  MenuItemResponseDto,
  MenuResponseDto,
  ProductResponseDto,
} from '@burger-shop/interfaces';
import { FilterQuery, isObjectIdOrHexString, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from '@burger-shop/models';
import { In, ObjectID } from 'typeorm';
import { MenuItemModel } from '../infrastructure/database/model/menu-item.model';
import { MenuModel } from '../infrastructure/database/model/menu.model';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { MenuEventNames } from '@burger-shop/event-store';

@Injectable()
export default class ProductQueryService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('MenuRepository')
    private readonly menuRepository: MenuAbstractRepository
  ) {}

  public async getById(id: string): Promise<ProductGetByIdQueryResponse> {
    if (isObjectIdOrHexString(id) === false) return null;
    const product = await this.productRepository.find(id);

    return {
      product: {
        id: product.id,
        name: product.name,
        imgLink: product.imgLink,
      },
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
      item: ProductQueryService.mapMenuItem(item),
    };
  }

  public async find(
    dto: ProductFindQueryRequest
  ): Promise<ProductFindQueryResponse> {
    const filter: FilterQuery<ProductDocument> = {};
    if (dto.ids) {
      filter._id = { $in: dto.ids };
    }
    const products = await this.productRepository.findMany(
      filter,
      dto.take,
      dto.skip
    );
    return {
      products: products.map(ProductQueryService.mapProduct),
    };
  }

  public async findMenu(
    dto: MenuFindQueryRequest
  ): Promise<MenuFindQueryResponse> {
    const menus = await this.menuRepository.findMany(dto);
    const menusResponse: MenuResponseDto[] = menus.map(
      ProductQueryService.mapMenu
    );
    return {
      menus: menusResponse,
    };
  }

  public async onCreated(dto: ProductCreatedEventPayload): Promise<void> {
    const { name, id, imgLink } = dto.product;
    await this.productRepository.create({ id, name, imgLink });
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
    if (dto.eventName === MenuEventNames.menuActivated) {
      await this.menuRepository.update(menu.id, {
        active: true,
      });
    }
    if (dto.eventName === MenuEventNames.menuDeactivated) {
      await this.menuRepository.update(menu.id, {
        active: false,
      });
    }
    if (dto.eventName === MenuEventNames.menuItemsUpdated) {
      await this.menuRepository.update(menu.id, {
        items: menu.items.map((item, idx) => {
          const { productId } = item;
          return { ...item, id: idx, product: productId };
        }),
      });
    }
  }

  public async getMenu(
    dto: MenuGetQueryRequest
  ): Promise<MenuGetQueryResponse> {
    const result = await this.menuRepository.get(dto.id);
    return { menu: result };
  }

  private static mapMenu(menu: MenuModel): MenuResponseDto {
    return {
      id: menu.id,
      items: menu.items.map(ProductQueryService.mapMenuItem),
      active: menu.active,
    };
  }

  private static mapMenuItem(item: MenuItemModel): MenuItemResponseDto {
    return {
      id: item.id,
      available: item.available,
      price: item.price,
      product: ProductQueryService.mapProduct(item.product),
    };
  }

  private static mapProduct(product: Product): ProductResponseDto {
    return { id: product.id, name: product.name, imgLink: product.imgLink };
  }
}
