import {
  MenuCreatedEventPayload,
  MenuUpdatedEventPayload,
} from '@burger-shop/contracts';
import {
  MenuDomainEntity,
  MenuItemDomainEntity,
} from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';

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
