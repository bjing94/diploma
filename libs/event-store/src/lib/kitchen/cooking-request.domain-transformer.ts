import {
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CookingRequestDomainEntity } from '@burger-shop/domain-entity';
import { CookingRequestStatus, ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import { CookingRequestEventNames } from '../event-store.const';

export default class CookingRequestDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const domain = new CookingRequestDomainEntity({
      id: '',
      status: CookingRequestStatus.PENDING,
      productId: '',
    });
    events.forEach((event) => {
      this.applyEvent(domain, event);
    });
    return domain;
  }

  private static applyEvent(
    domain: CookingRequestDomainEntity,
    event: ISaveEvent
  ) {
    if (event.name === CookingRequestEventNames.requestSnapshot) {
      const { id, status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.status = status;
    }
    if (event.name === CookingRequestEventNames.requestCreated) {
      const { id, status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.status = status;
    }
    if (event.name === CookingRequestEventNames.requestReady) {
      const { status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestUpdatedEventPayload;
      domain.status = status;
    }
    if (event.name === CookingRequestEventNames.requestRejected) {
      const { status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestUpdatedEventPayload;
      domain.status = status;
    }
  }

  public static snapshot(domain: CookingRequestDomainEntity): ISaveEvent {
    const payload: CookingRequestCreatedEventPayload = {
      id: domain.id,
      status: domain.status,
      productId: domain.productId,
      eventName: CookingRequestEventNames.requestSnapshot,
    };
    return {
      objectId: domain.id,
      name: CookingRequestEventNames.requestSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
