import {
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
} from '@burger-shop/contracts';
import { CookingRequestDomainEntity } from '@burger-shop/domain-entity';
import { CookingRequestStatus, ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';

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
    if (event.name === 'snapshot') {
      const { id, status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.status = status;
    }
    if (event.name === EventTopics.orderCreated) {
      const { id, status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestCreatedEventPayload;
      domain.id = id;
      domain.productId = productId;
      domain.status = status;
    }
    if (event.name === EventTopics.orderUpdated) {
      const { status, productId } = JSON.parse(
        event.payload
      ) as CookingRequestUpdatedEventPayload;
      domain.productId = productId;
      domain.status = status;
    }
  }

  public static snapshot(domain: CookingRequestDomainEntity): ISaveEvent {
    const payload: CookingRequestCreatedEventPayload = {
      id: domain.id,
      status: domain.status,
      productId: domain.productId,
    };
    return {
      objectId: domain.id,
      name: 'snapshot',
      payload: JSON.stringify(payload),
    };
  }
}
