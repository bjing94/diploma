import {
  ProductUpdatedEventPayload,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
} from '@burger-shop/contracts';
import { ProductDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';

export default class ProductDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const product = new ProductDomainEntity('', 0, '');
    events.forEach((event) => {
      this.applyEvent(product, event);
    });
    return product;
  }

  private static applyEvent(domain: ProductDomainEntity, event: ISaveEvent) {
    if (event.name === 'snapshot') {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.id = product.id;
      domain.name = product.name;
      domain.price = product.price;
      domain.active = true;
    }
    if (event.name === EventTopics.productCreated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductCreatedEventPayload;
      domain.id = product.id;
      domain.name = product.name;
      domain.price = product.price;
      domain.active = true;
    }
    if (event.name === EventTopics.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.name = product.name;
      domain.price = product.price;
    }
    if (event.name === EventTopics.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.name = product.name;
      domain.price = product.price;
    }
    if (event.name === EventTopics.productDeleted) {
      const { id } = JSON.parse(event.payload) as ProductDeletedEventPayload;
      domain.active = false;
    }
  }

  public static snapshot(domain: ProductDomainEntity): ISaveEvent {
    const payload: ProductUpdatedEventPayload = {
      product: {
        id: domain.id,
        name: domain.name,
        price: domain.price,
      },
    };
    return {
      objectId: domain.id,
      name: 'snapshot',
      payload: JSON.stringify(payload),
    };
  }
}
