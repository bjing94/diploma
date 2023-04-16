import {
  OrderCreatedEventPayload,
  OrderUpdatedEventPayload,
} from '@burger-shop/contracts';
import {
  OrderDomainEntity,
  OrderItemDomainEntity,
} from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import { OrderEventNames } from '../event-store.const';

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
    if (event.name === OrderEventNames.orderSnapshot) {
      const { order } = JSON.parse(event.payload) as OrderCreatedEventPayload;
      domain.id = order.id;
      domain.orderItems = order.orderItems.map((item) => {
        return new OrderItemDomainEntity({
          quantity: item.quantity,
          product: { id: item.productId },
          price: item.price,
        });
      });
      domain.paymentId = order.paymentId;
      domain.status = order.status;
    }
    if (event.name === OrderEventNames.orderCreated) {
      const { order } = JSON.parse(event.payload) as OrderCreatedEventPayload;
      domain.id = order.id;
      domain.orderItems = order.orderItems.map((item) => {
        return new OrderItemDomainEntity({
          quantity: item.quantity,
          product: { id: item.productId },
          price: item.price,
        });
      });
      domain.paymentId = order.paymentId;
      domain.status = order.status;
    }
    if (event.name === OrderEventNames.orderCanceled) {
      const { order } = JSON.parse(event.payload) as OrderUpdatedEventPayload;
      domain.status = order.status;
    }
    if (event.name === OrderEventNames.orderCompleted) {
      const { order } = JSON.parse(event.payload) as OrderUpdatedEventPayload;
      domain.status = order.status;
    }
    if (event.name === OrderEventNames.orderPayed) {
      const { order } = JSON.parse(event.payload) as OrderUpdatedEventPayload;
      domain.status = order.status;
    }
    if (event.name === OrderEventNames.orderReadyForPickup) {
      const { order } = JSON.parse(event.payload) as OrderUpdatedEventPayload;
      domain.status = order.status;
    }
  }

  public static snapshot(domain: OrderDomainEntity): ISaveEvent {
    const payload: OrderCreatedEventPayload = {
      order: {
        id: domain.id,
        orderItems: domain.orderItems.map((item) => {
          return {
            id: item.id,
            price: item.price,
            productId: item.product.id,
            quantity: item.quantity,
          };
        }),
        paymentId: domain.paymentId,
        status: domain.status,
      },
    };
    return {
      objectId: domain.id,
      name: OrderEventNames.orderSnapshot,
      payload: JSON.stringify(payload),
    };
  }
}
