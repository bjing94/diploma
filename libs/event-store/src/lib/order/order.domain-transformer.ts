import {
  MenuCreatedEventPayload,
  MenuUpdatedEventPayload,
} from '@burger-shop/contracts';
import {
  MenuDomainEntity,
  MenuItemDomainEntity,
  OrderDomainEntity,
} from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';

export default class OrderDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const domain = new OrderDomainEntity({
      items: [],
      paymentId: '',
    });
    events.forEach((event) => {
      this.applyEvent(domain, event);
    });
    return domain;
  }

  private static applyEvent(domain: OrderDomainEntity, event: ISaveEvent) {
    if (event.name === 'snapshot') {
      const { menu } = JSON.parse(event.payload) as OrderUpd;
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
    if (event.name === EventTopics.menuCreated) {
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
    if (event.name === EventTopics.menuUpdated) {
      const { menu } = JSON.parse(event.payload) as MenuUpdatedEventPayload;
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
  }

  public static snapshot(domain: MenuDomainEntity): ISaveEvent {
    const payload: MenuUpdatedEventPayload = {
      menu: {
        id: domain.id,
        active: domain.active,
        items: domain.items,
      },
    };
    return {
      objectId: domain.id,
      name: 'snapshot',
      payload: JSON.stringify(payload),
    };
  }
}
