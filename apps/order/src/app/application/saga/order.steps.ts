import {
  OrderDomainEntity,
  OrderItemDomainEntity,
} from '@burger-shop/domain-entity';
import CreateOrderSagaState from './order.state';
import {
  OrderCreateCommandRequest,
  OrderCreatedEventPayload,
  OrderUpdateCommandRequest,
  OrderUpdatedEventPayload,
  PaymentStatusUpdatedEventPayload,
} from '@burger-shop/contracts';
import CreateOrderSaga from './order.saga';
import { Logger } from '@nestjs/common';
import { EventTopics } from '@burger-shop/kafka-module';
import { PaymentStatus, OrderStatus } from '@burger-shop/interfaces';

// Заказ не создан
export class CreateOrderNewStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  //   Здесь бизнес логика + сохранение в бд. Оповещение о событиях
  public async create(dto: OrderCreateCommandRequest) {
    const { orderItems, paymentInfo } = dto;
    const orderDomainItems: OrderItemDomainEntity[] = [];
    let idx = 0;
    let sum = 0;
    for (const item of orderItems) {
      const response = await this.saga.kafkaProducerService.sendMenuItemGet({
        id: item.menuItemId,
      });
      Logger.verbose(`Response ${JSON.stringify(response)}`);
      if (!response || !response.item) {
        Logger.error(`Menu item doesn't exist!`);
        return null;
      }
      const { price } = response.item;
      const { product } = response.item;
      orderDomainItems.push(
        new OrderItemDomainEntity({
          price,
          product: { id: product.id },
          quantity: item.count,
          id: idx,
        })
      );
      sum += price * item.count;
      idx++;
    }

    const order = new OrderDomainEntity({
      paymentId: '',
      items: orderDomainItems,
    });

    // Payment service
    const response = await this.saga.kafkaProducerService.sendPaymentCreate({
      sum,
      type: paymentInfo.type,
      orderId: order.id,
    });
    if (!response) {
      Logger.error(`Payment not created!`);
      return null;
    }
    order.paymentId = response.id;

    const payload: OrderCreatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
        orderItems: order.orderItems.map((item) => {
          return {
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price,
          };
        }),
        paymentId: order.paymentId,
      },
    };

    await this.saga.kafkaProducerService.emitOrderCreated(payload);
    await this.saga.eventStoreService.saveEvent({
      name: EventTopics.orderCreated,
      payload: JSON.stringify(payload),
      objectId: order.id,
    });
    return { orderId: order.id, paymentId: order.paymentId };
  }

  public pay() {
    throw new Error('Заказ не создан');
  }
  public cancel() {
    throw new Error('Заказ не создан');
  }
  public ready() {
    throw new Error('Заказ не создан');
  }
  public complete() {
    throw new Error('Заказ не создан');
  }
}

// Заказ не оплачен
export class CreateOrderPayStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    throw new Error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload): Promise<void> {
    const order = await this.saga.eventStoreService.getOrder(data.orderId);
    if (!order) return;

    if (data.status === PaymentStatus.FULFILLED) {
      order.status = OrderStatus.PAYED;

      const payload: OrderUpdatedEventPayload = {
        order: {
          id: order.id,
          status: order.status,
        },
      };

      await this.saga.eventStoreService.saveEvent({
        objectId: order.id,
        payload: JSON.stringify(payload),
        name: EventTopics.orderUpdated,
      });

      await this.saga.kafkaProducerService.emitOrderUpdated({
        order: {
          id: order.id,
          status: order.status,
        },
      });
    }
  }

  public cancel() {
    throw new Error('Заказ не оплачен');
  }
  public ready() {
    throw new Error('Заказ не оплачен');
  }
  public complete() {
    throw new Error('Заказ не оплачен');
  }
}

// Заказ не собран
export class CreateOrderMarkReadyStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    throw new Error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload) {
    throw new Error('Заказ уже оплачен');
  }

  public cancel() {
    throw new Error('Заказ не оплачен');
  }

  public async ready(dto: OrderUpdateCommandRequest) {
    const order = await this.saga.eventStoreService.getOrder(dto.id);
    if (!order) return;

    order.status = OrderStatus.WAITING_FOR_PICKUP;

    const payload: OrderUpdatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
      },
    };

    await this.saga.eventStoreService.saveEvent({
      objectId: order.id,
      payload: JSON.stringify(payload),
      name: EventTopics.orderUpdated,
    });

    await this.saga.kafkaProducerService.emitOrderUpdated({
      order: {
        id: order.id,
        status: order.status,
      },
    });
  }

  public complete() {
    throw new Error('Заказ не оплачен');
  }
}

// Заказ не выдан
export class CreateOrderMarkCompleteStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    throw new Error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload) {
    throw new Error('Заказ уже оплачен');
  }

  public cancel() {
    throw new Error('Заказ не оплачен');
  }

  public async ready(dto: OrderUpdateCommandRequest) {
    throw new Error('Заказ не оплачен');
  }

  public async complete(dto: OrderUpdateCommandRequest) {
    const order = await this.saga.eventStoreService.getOrder(dto.id);
    if (!order) return;

    order.status = OrderStatus.COMPLETED;

    const payload: OrderUpdatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
      },
    };

    await this.saga.eventStoreService.saveEvent({
      objectId: order.id,
      payload: JSON.stringify(payload),
      name: EventTopics.orderUpdated,
    });

    await this.saga.kafkaProducerService.emitOrderUpdated({
      order: {
        id: order.id,
        status: order.status,
      },
    });
  }
}
