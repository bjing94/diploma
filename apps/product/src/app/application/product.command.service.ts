import {
  ProductCreateRequest,
  ProductCreateResponse,
} from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { MenuItemCreateRequestDto } from '@burger-shop/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import MenuItemDomainEntity from '../domain/menu-item.domain-entity';
import MenuDomainEntity from '../domain/menu.domain-entity';
import { KafkaProducerService } from '../infrastructure/kafka/kafka-producer.service';
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

  // public async createMenu(
  //   data: MenuCreate.Request
  // ): Promise<MenuCreate.Response> {
  //   const { items } = data;
  //   const domainItems: MenuItemDomainEntity[] = [];

  //   let idx = 0;
  //   for (const item of items) {
  //     const product = await this.productRepository.find(item.productId);
  //     if (!product) return { success: false };
  //     const domainProduct = ProductDomainMapper.toDomain(product);
  //     domainItems.push(
  //       new MenuItemDomainEntity(domainProduct, true, item.price, idx)
  //     );
  //     idx++;
  //   }

  //   const menu = new MenuDomainEntity(domainItems, 1);
  //   const product = await this.productRepository.find(1);
  //   if (!product) return;

  //   await this.menuRepoProvider.repository.create({
  //     id: menu.id,
  //     items: menu.items.map((item) => {
  //       return {
  //         id: item.id,
  //         price: item.price,
  //         available: item.available,
  //         product: product,
  //       };
  //     }),
  //   });
  //   await this.kafkaProducerService.emitMenuCreated({
  //     menu: {
  //       id: menu.id,
  //       items: menu.items,
  //     },
  //   });
  //   return {
  //     success: true,
  //   };
  // }

  // public async updateMenu(
  //   data: MenuUpdate.Request
  // ): Promise<MenuUpdate.Response> {
  //   const { menu: updatedMenu } = data;
  //   const menu = await this.menuRepoProvider.repository.find(updatedMenu.id);
  //   if (!menu) return { success: false };
  //   const newMenuItems = await this.getMenuItems(updatedMenu.items);
  //   const menuDomain = MenuDomainMapper.toDomain(menu);
  //   menuDomain.items = newMenuItems;
  // }

  // private async getMenuItems(items: MenuItemCreateRequestDto[]) {
  //   const domainItems: MenuItemDomainEntity[] = [];

  //   let idx = 0;
  //   for (const item of items) {
  //     const product = await this.productRepository.find(item.productId);
  //     if (!product) return [];
  //     const domainProduct = ProductDomainMapper.toDomain(product);
  //     domainItems.push(
  //       new MenuItemDomainEntity(domainProduct, true, item.price, idx)
  //     );
  //     idx++;
  //   }
  //   return domainItems;
  // }
}
