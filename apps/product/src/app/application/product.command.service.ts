import { ProductCreate } from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from '../infrastructure/kafka/kafka-producer.service';
import ProductDomainMapper from './mapper/product.domain.mapper';
import ProductRepositoryProvider from './provider/product.repository-provider';
import ProductAbstractRepository from './repository/product.abstract-repository';

@Injectable()
export default class ProductCommandService {
  private productRepo: ProductAbstractRepository;
  constructor(
    productRepoProvider: ProductRepositoryProvider,
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
}
