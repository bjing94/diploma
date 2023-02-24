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
  ProductGetByIdQueryRequest,
  ProductGetByIdQueryResponse,
  ProductGetMenuItemQueryRequest,
  ProductGetMenuItemQueryResponse,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, QueryTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import EventSnapshotInterceptor from './interceptor/event-snapshot.interceptor';
import ProductQueryService from './product.query.service';

@UseInterceptors(EventSnapshotInterceptor)
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

  // @MessagePattern(EventTopics.productCreated)
  // public async onProductCreated(
  //   @Payload() payload: ProductCreatedEventPayload
  // ): Promise<void> {
  //   return this.productQueryService.onCreated(payload);
  // }

  // @MessagePattern(EventTopics.productUpdated)
  // public async onProductUpdated(
  //   @Payload() payload: ProductUpdatedEventPayload
  // ): Promise<void> {
  //   return this.productQueryService.onUpdated(payload);
  // }

  // @MessagePattern(EventTopics.productDeleted)
  // public async onProductDeleted(
  //   @Payload() payload: ProductDeletedEventPayload
  // ): Promise<void> {
  //   return this.productQueryService.onDeleted(payload);
  // }

  @MessagePattern(QueryTopics.menuGet)
  public async getProductMenuById(
    @Payload() payload: MenuGetQueryRequest
  ): Promise<MenuGetQueryResponse> {
    return this.productQueryService.getMenu(payload);
  }

  // @MessagePattern(EventTopics.menuCreated)
  // public async onMenuCreated(
  //   @Payload() payload: MenuCreatedEventPayload
  // ): Promise<void> {
  //   return this.productQueryService.onMenuCreated(payload);
  // }

  // @MessagePattern(EventTopics.menuUpdated)
  // public async onMenuUpdated(
  //   @Payload() payload: MenuUpdatedEventPayload
  // ): Promise<void> {
  //   return this.productQueryService.onMenuUpdated(payload);
  // }

  @MessagePattern(QueryTopics.menuFind)
  public async findMenu(
    @Payload() payload: MenuFindQueryRequest
  ): Promise<MenuFindQueryResponse> {
    return this.productQueryService.findMenu(payload);
  }

  @MessagePattern(QueryTopics.menuItemGet)
  public async getMenuItemById(
    @Payload() payload: ProductGetMenuItemQueryRequest
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.productQueryService.getItemFromMenu(payload.id);
  }
}
