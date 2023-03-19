import {
  CookingRequestCreatedEventPayload,
  OrderCreatedEventPayload,
} from '@burger-shop/contracts';
import { CookingRequestDomainEntity } from '@burger-shop/domain-entity';
import { EventStoreKitchenService } from '@burger-shop/event-store';
import { CookingRequestStatus } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class KitchenCommandService {
  constructor(private readonly eventStore: EventStoreKitchenService) {}
  public async handleOrderCreated(data: OrderCreatedEventPayload) {
    const cookingRequests: CookingRequestDomainEntity[] = [];
    data.order.orderItems.forEach((item) => {
      cookingRequests.push(
        new CookingRequestDomainEntity({
          productId: item.productId,
          status: CookingRequestStatus.PENDING,
        })
      );
    });
    for (const req of cookingRequests) {
      const payload: CookingRequestCreatedEventPayload = {
        id: req.id,
        productId: req.productId,
        status: req.status,
      };
      await this.eventStore.saveCookingRequestEvent({
        objectId: req.id,
        payload: JSON.stringify(payload),
        name: EventTopics.cookingRequestCreated,
      });
    }
  }
}

// Consumet stockpile after events
