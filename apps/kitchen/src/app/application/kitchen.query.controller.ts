import {
  CookingRequestCreatedEventPayload,
  CookingRequestFindQueryRequest,
  CookingRequestGetQueryRequest,
  CookingRequestUpdatedEventPayload,
  CookingStockCreatedEventPayload,
  CookingStockGetQueryRequest,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics, QueryTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import KitchenQueryService from './kitchen.query.service';

@Controller()
export default class KitchenQueryController {
  constructor(private readonly kitchenQueryService: KitchenQueryService) {}

  @MessagePattern(EventTopics.cookingRequestCreated)
  public async onCreated(@Payload() data: CookingRequestCreatedEventPayload) {
    await this.kitchenQueryService.onCookingRequestCreated(data);
  }

  @MessagePattern(EventTopics.cookingRequestUpdated)
  public async onUpdated(@Payload() data: CookingRequestUpdatedEventPayload) {
    await this.kitchenQueryService.onCookingRequestUpdated(data);
  }

  @MessagePattern(EventTopics.cookingStockCreated)
  public async onStockCreated(
    @Payload() data: CookingStockCreatedEventPayload
  ) {
    await this.kitchenQueryService.onCookingStockCreated(data);
  }

  @MessagePattern(EventTopics.cookingStockUpdated)
  public async onStockUpdated(
    @Payload() data: CookingStockUpdatedEventPayload
  ) {
    await this.kitchenQueryService.onCookingStockUpdated(data);
  }

  @MessagePattern(QueryTopics.cookingRequestGet)
  public async requestGet(@Payload() data: CookingRequestGetQueryRequest) {
    return this.kitchenQueryService.getCookingRequest(data);
  }

  @MessagePattern(QueryTopics.cookingStockGet)
  public async stockGet(@Payload() data: CookingStockGetQueryRequest) {
    return this.kitchenQueryService.getCookingStock(data);
  }

  @MessagePattern(QueryTopics.cookingRequestFind)
  public async requestFind(@Payload() data: CookingRequestFindQueryRequest) {
    return this.kitchenQueryService.findCookingRequest(data);
  }
}
