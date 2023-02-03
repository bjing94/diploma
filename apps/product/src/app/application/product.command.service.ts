import { MenuCreate, ProductCreate } from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { Injectable } from '@nestjs/common';
import MenuItemDomainEntity from '../domain/menu-item.domain-entity';
import MenuDomainEntity from '../domain/menu.domain-entity';
import { KafkaProducerService } from '../infrastructure/kafka/kafka-producer.service';
import ProductDomainMapper from './mapper/product.domain.mapper';
import ProductRepositoryProvider from './provider/product.repository-provider';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  private productRepo: ProductAbstractRepository;
  constructor(
    private readonly productRepoProvider: ProductRepositoryProvider,
    private readonly kafkaProducerService: KafkaProducerService
  ) {
    this.productRepo = productRepoProvider.repository;
  }

  public async create(
    dto: ProductCreate.Request
  ): Promise<ProductCreate.Response> {
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

  public async createMenu(
    data: MenuCreate.Request
  ): Promise<MenuCreate.Response> {
    const { items } = data;
    const domainItems: MenuItemDomainEntity[] = [];

    let idx = 0;
    for (const item of items) {
      const product = await this.productRepoProvider.repository.find(
        item.productId
      );
      if (!product) return { success: false };
      const domainProduct = ProductDomainMapper.toDomain(product);
      domainItems.push(
        new MenuItemDomainEntity(domainProduct, true, item.price, idx)
      );
      idx++;
    }
    const menu = new MenuDomainEntity(domainItems, 1);

    await this.kafkaProducerService.emitMenuCreated({
      menu: {
        id: menu.id,
        items: menu.items,
      },
    });
    return {
      success: true,
    };
  }

  // public async updateMenu(
  //   data: MenuUpdate.Request
  // ): Promise<MenuUpdate.Response> {}
}
