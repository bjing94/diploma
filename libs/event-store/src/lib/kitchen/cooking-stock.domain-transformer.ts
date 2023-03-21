import {
  CookingStockCreatedEventPayload,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CookingStockDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';

export default class CookingStockDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const domain = new CookingStockDomainEntity({
      id: '',
      productId: '',
      quantity: 0,
    });
    events.forEach((event) => {
      this.applyEvent(domain, event);
    });
    return domain;
  }

  private static applyEvent(
    domain: CookingStockDomainEntity,
    event: ISaveEvent
  ) {
    if (event.name === 'snapshot') {
      const { id, quantity, productId } = JSON.parse(
        event.payload
      ) as CookingStockCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.quantity = quantity;
    }
    if (event.name === EventTopics.cookingStockCreated) {
      const { id, quantity, productId } = JSON.parse(
        event.payload
      ) as CookingStockCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.quantity = quantity;
    }
    if (event.name === EventTopics.cookingStockUpdated) {
      const { quantity } = JSON.parse(
        event.payload
      ) as CookingStockUpdatedEventPayload;
      domain.quantity = quantity;
    }
  }

  public static snapshot(domain: CookingStockDomainEntity): ISaveEvent {
    const payload: CookingStockCreatedEventPayload = {
      id: domain.id,
      productId: domain.productId,
      quantity: domain.quantity,
    };
    return {
      objectId: domain.id,
      name: 'snapshot',
      payload: JSON.stringify(payload),
    };
  }
}
