import {
  CookingStockCreatedEventPayload,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CookingStockDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import { CookingStockEventNames } from '../event-store.const';

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
    if (event.name === CookingStockEventNames.stockSnapshot) {
      const { id, quantity, productId } = JSON.parse(
        event.payload
      ) as CookingStockCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.quantity = quantity;
    }
    if (event.name === CookingStockEventNames.stockCreated) {
      const { id, quantity, productId } = JSON.parse(
        event.payload
      ) as CookingStockCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.quantity = quantity;
    }
    if (event.name === CookingStockEventNames.stockQuantityChanged) {
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
      name: CookingStockEventNames.stockSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
