import {
  PaymentCreatedEventPayload,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import { PaymentDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent, PaymentType } from '@burger-shop/interfaces';
import { PaymentEventNames } from '../event-store.const';

export default class PaymentDomainTransformer {
  public static hydrate(events: ISaveEvent[]) {
    const domain = new PaymentDomainEntity({
      sum: 0,
      type: PaymentType.CARD,
      orderId: '',
    });
    events.forEach((event) => {
      this.applyEvent(domain, event);
    });
    return domain;
  }

  private static applyEvent(domain: PaymentDomainEntity, event: ISaveEvent) {
    if (event.name === PaymentEventNames.paymentSnapshot) {
      const { payment } = JSON.parse(
        event.payload
      ) as PaymentCreatedEventPayload;
      domain.id = payment.id;
      domain.link = payment.link ?? '';
      domain.status = payment.status;
      domain.sum = payment.sum;
      domain.type = payment.type;
    }
    if (event.name === PaymentEventNames.paymentCreated) {
      const { payment } = JSON.parse(
        event.payload
      ) as PaymentCreatedEventPayload;
      domain.id = payment.id;
      domain.link = payment.link ?? '';
      domain.status = payment.status;
      domain.sum = payment.sum;
      domain.type = payment.type;
    }
    if (event.name === PaymentEventNames.paymentFulfilled) {
      const { status } = JSON.parse(
        event.payload
      ) as PaymentStatusUpdatedEventPayload;
      domain.status = status;
    }
    if (event.name === PaymentEventNames.paymentRejected) {
      const { status } = JSON.parse(
        event.payload
      ) as PaymentStatusUpdatedEventPayload;
      domain.status = status;
    }
    if (event.name === PaymentEventNames.paymentRefunded) {
      const { status } = JSON.parse(
        event.payload
      ) as PaymentStatusUpdatedEventPayload;
      domain.status = status;
    }
  }

  public static snapshot(domain: PaymentDomainEntity): ISaveEvent {
    const payload: PaymentCreatedEventPayload = {
      payment: {
        id: domain.id,
        link: domain.link,
        status: domain.status,
        sum: domain.sum,
        type: domain.type,
        orderId: domain.orderId,
      },
    };
    return {
      objectId: domain.id,
      name: PaymentEventNames.paymentSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
