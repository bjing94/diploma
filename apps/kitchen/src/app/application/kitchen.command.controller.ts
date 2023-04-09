import {
  CookingRequestCreateCommandRequest,
  CookingRequestUpdateCommandRequest,
  CookingRequestUpdatedEventPayload,
  CookingStockAddCommandRequest,
  OrderCreatedEventPayload,
} from '@burger-shop/contracts';
import { CommandTopics, EventTopics } from '@burger-shop/kafka-module';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import KitchenCommandService from './kitchen.command.service';

@Controller()
export default class KitchenCommandController {
  constructor(private readonly service: KitchenCommandService) {}

  @MessagePattern(CommandTopics.cookingStockAdd)
  async addCookingStock(
    @Payload() dto: CookingStockAddCommandRequest
  ): Promise<void> {
    await this.service.handleAddStock(dto);
  }

  @MessagePattern(CommandTopics.cookingRequestCreate)
  async createCookingRequest(
    @Payload() dto: CookingRequestCreateCommandRequest
  ): Promise<void> {
    await this.service.createCookingRequest(dto);
  }

  @MessagePattern(CommandTopics.cookingRequestUpdate)
  async updateCookingRequest(
    @Payload() dto: CookingRequestUpdateCommandRequest
  ): Promise<void> {
    await this.service.updateCookingRequest(dto);
  }

  @MessagePattern(CommandTopics.kitchenClearRead)
  async kitchenClearRead() {
    await this.service.kitchenClearRead();
  }
}
