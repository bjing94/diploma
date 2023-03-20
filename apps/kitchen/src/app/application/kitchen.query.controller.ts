import {
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import KitchenQueryService from './kitchen.query.service';

@Controller()
export default class KitchenQueryController {
  constructor(private readonly service: KitchenQueryService) {}

  @MessagePattern(EventTopics.cookingRequestCreated)
  public async onCreated(@Payload() data: CookingRequestCreatedEventPayload) {
    await this.service.onCookingRequestCreated(data);
  }

  @MessagePattern(EventTopics.cookingRequestUpdated)
  public async onUpdated(@Payload() data: CookingRequestUpdatedEventPayload) {
    await this.service.onCookingRequestUpdated(data);
  }
}
