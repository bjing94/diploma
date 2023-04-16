import {
  MenuCreatedEventPayload,
  MenuSnapshotEventPayload,
} from '@burger-shop/contracts';
import {
  MenuDomainEntity,
  MenuItemDomainEntity,
} from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { MenuEventNames } from '../event-store.const';

export default class MenuDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const menu = new MenuDomainEntity([]);
    events.forEach((event) => {
      this.applyEvent(menu, event);
    });
    return menu;
  }

  private static applyEvent(domain: MenuDomainEntity, event: ISaveEvent) {
    if (event.name === MenuEventNames.menuSnapshot) {
      const { menu } = JSON.parse(event.payload) as MenuSnapshotEventPayload;
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
    if (event.name === MenuEventNames.menuCreated) {
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
    if (event.name === MenuEventNames.menuActivated) {
      domain.active = true;
    }
    if (event.name === MenuEventNames.menuDeactivated) {
      domain.active = false;
    }
  }

  public static snapshot(domain: MenuDomainEntity): ISaveEvent {
    const payload: MenuSnapshotEventPayload = {
      menu: {
        id: domain.id,
        active: domain.active,
        items: domain.items,
      },
      eventName: MenuEventNames.menuSnapshot,
    };
    return {
      objectId: domain.id,
      name: MenuEventNames.menuSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
