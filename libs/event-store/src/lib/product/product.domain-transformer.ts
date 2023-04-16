import {
  ProductUpdatedEventPayload,
  ProductCreatedEventPayload,
} from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { ProductEventNames } from '../event-store.const';

export default class ProductDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const product = new ProductDomainEntity('', '');
    events.forEach((event) => {
      this.applyEvent(product, event);
    });
    return product;
  }

  private static applyEvent(domain: ProductDomainEntity, event: ISaveEvent) {
    if (event.name === ProductEventNames.productSnapshot) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.id = product.id;
      domain.name = product.name;
      domain.active = true;
    }
    if (event.name === ProductEventNames.productCreated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductCreatedEventPayload;
      domain.id = product.id;
      domain.name = product.name;
      domain.active = true;
    }
    if (event.name === ProductEventNames.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.name = product.name;
    }
  }

  public static snapshot(domain: ProductDomainEntity): ISaveEvent {
    const payload: ProductUpdatedEventPayload = {
      product: {
        id: domain.id,
        name: domain.name,
      },
      eventName: ProductEventNames.productSnapshot,
    };
    return {
      objectId: domain.id,
      name: ProductEventNames.productSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
