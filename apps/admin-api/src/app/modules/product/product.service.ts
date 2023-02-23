import {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductFindQueryRequest,
  ProductUpdateRequest,
} from '@burger-shop/contracts';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ProductService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  public async create(
    dto: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    return this.kafkaProducerService.sendProductCreate(dto);
  }

  public async get(id: string) {
    return this.kafkaProducerService.sendProductGet({ id });
  }

  public async find(dto: ProductFindQueryRequest) {
    return this.kafkaProducerService.sendProductFind(dto);
  }

  public async delete(dto: ProductDeleteRequest) {
    return this.kafkaProducerService.sendProductDelete(dto);
  }

  public async update(dto: ProductUpdateRequest) {
    return this.kafkaProducerService.sendProductUpdate(dto);
  }
}
