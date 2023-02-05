import {
  MenuCreatedEventPayload,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryRequest,
  ProductGetByIdQueryResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, QueryTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductQueryService from './product.query.service';

@Controller()
export default class ProductQueryController {
  constructor(private readonly productQueryService: ProductQueryService) {}

  @MessagePattern(QueryTopics.productGet)
  public async getProductById(
    @Payload() payload: ProductGetByIdQueryRequest
  ): Promise<ProductGetByIdQueryResponse> {
    return this.productQueryService.getById(payload.id);
  }

  @MessagePattern(QueryTopics.productFind)
  public async find(
    @Payload() payload: ProductFindQueryRequest
  ): Promise<ProductFindQueryResponse> {
    return this.productQueryService.find(payload);
  }

  @MessagePattern(EventTopics.productCreated)
  public async onProductCreated(
    @Payload() payload: ProductCreatedEventPayload
  ): Promise<void> {
    return this.productQueryService.onCreated(payload);
  }

  @MessagePattern(EventTopics.productUpdated)
  public async onProductUpdated(
    @Payload() payload: ProductUpdatedEventPayload
  ): Promise<void> {
    return this.productQueryService.onUpdated(payload);
  }

  @MessagePattern(EventTopics.productDeleted)
  public async onProductDeleted(
    @Payload() payload: ProductDeletedEventPayload
  ): Promise<void> {
    return this.productQueryService.onDeleted(payload);
  }

  @MessagePattern(QueryTopics.menuGet)
  public async getProductMenuById(
    @Payload() payload: MenuGetQueryRequest
  ): Promise<any> {
    return this.productQueryService.getMenu(payload);
  }

  @MessagePattern(EventTopics.menuCreated)
  public async onMenuCreated(
    @Payload() payload: MenuCreatedEventPayload
  ): Promise<void> {
    return this.productQueryService.onMenuCreated(payload);
  }
}
