import {
  CookingRequestCreateCommandRequest,
  CookingRequestUpdateCommandRequest,
  CookingStockAddCommandRequest,
} from '@burger-shop/contracts';
import { CommandTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import KitchenCommandService from './kitchen.command.service';

@Controller()
export default class KitchenCommandController {
  constructor(private readonly kitchenCommandService: KitchenCommandService) {}

  @MessagePattern(CommandTopics.cookingStockAdd)
  async addCookingStock(
    @Payload() dto: CookingStockAddCommandRequest
  ): Promise<void> {
    await this.kitchenCommandService.handleAddStock(dto);
  }

  @MessagePattern(CommandTopics.cookingRequestCreate)
  async createCookingRequest(
    @Payload() dto: CookingRequestCreateCommandRequest
  ): Promise<void> {
    await this.kitchenCommandService.createCookingRequest(dto);
  }

  @MessagePattern(CommandTopics.cookingRequestUpdate)
  async updateCookingRequest(
    @Payload() dto: CookingRequestUpdateCommandRequest
  ): Promise<void> {
    await this.kitchenCommandService.updateCookingRequest(dto);
  }

  @MessagePattern(CommandTopics.kitchenClearRead)
  async kitchenClearRead() {
    await this.kitchenCommandService.kitchenClearRead();
  }
}
