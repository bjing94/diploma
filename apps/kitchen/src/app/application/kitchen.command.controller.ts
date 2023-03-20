import { OrderCreatedEventPayload } from '@burger-shop/contracts';
import { EventTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
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
}
