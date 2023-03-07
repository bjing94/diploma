import {
  ProductUpdatedEventPayload,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  MenuCreatedEventPayload,
} from '@burger-shop/contracts';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import MenuItemDomainEntity from 'libs/domain-entity/src/lib/menu-item.domain-entity';
import MenuDomainEntity from 'libs/domain-entity/src/lib/menu.domain-entity';

export default class MenuDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const menu = new MenuDomainEntity([]);
    events.forEach((event) => {
      this.applyEvent(menu, event);
    });
    return menu;
  }

  private static applyEvent(domain: MenuDomainEntity, event: ISaveEvent) {
    if (event.name === 'snapshot') {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      domain.id = product.id;
      me.name = product.name;
      domain.price = product.price;
      domain.active = true;
    }
    if (event.name === EventTopics.productCreated) {
      const { menu } = JSON.parse(event.payload) as MenuCreatedEventPayload;
      domain.id = menu.id;
      domain.active = menu.active;
      domain.items = menu.items.map((item) => {
        return new MenuItemDomainEntity(
          item.productId,
          item.available,
          item.price,
          item.id
        );
      });
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

  public static snapshot(domain: MenuDomainEntity): ISaveEvent {
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
