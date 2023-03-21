import {
  CookingRequestUpdateCommandRequest,
  CookingRequestUpdatedEventPayload,
  OrderCreatedEventPayload,
} from '@burger-shop/contracts';
import { CommandTopics, EventTopics } from '@burger-shop/kafka-module';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import KitchenCommandService from './kitchen.command.service';

@Controller()
export default class KitchenCommandController {
  constructor(private readonly service: KitchenCommandService) {}

  @MessagePattern(EventTopics.orderCreated)
  async onOrderCreated(
    @Payload() dto: OrderCreatedEventPayload
  ): Promise<void> {
    await this.service.handleOrderCreated(dto);
  }

  @MessagePattern(CommandTopics.cookingRequestUpdate)
  async updateCookingRequest(
    @Payload() dto: CookingRequestUpdateCommandRequest
  ): Promise<void> {
    await this.service.updateCookingRequest(dto);
  }

  // @MessagePattern(EventTopics.cookingRequestUpdated)
  // async onCookingRequestUpdated(
  //   @Payload() dto: CookingRequestUpdatedEventPayload
  // ): Promise<void> {
  //   Logger.log('Updating stock');
  //   await this.service.handleCookingRequestUpdated(dto);
  // }
}
