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
import { PaymentStatus, OrderStatus } from '@burger-shop/interfaces';
import { OrderEventNames } from '@burger-shop/event-store';

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
      eventName: OrderEventNames.orderCreated,
    };

    for (const item of payload.order.orderItems) {
      const stockData =
        await this.saga.kafkaProducerService.sendCookingStockGet({
          id: item.productId,
        });
      const missing = stockData?.quantity
        ? item.quantity - stockData.quantity
        : item.quantity;
      Logger.log(
        `Stock ${item.productId} ${stockData?.quantity}, missing ${missing}`
      );
      for (let i = 0; i < missing; i++) {
        await this.saga.kafkaProducerService.sendCookingRequestCreate({
          productId: item.productId,
        });
      }

      if (missing > 0 && stockData?.quantity > 0) {
        await this.saga.kafkaProducerService.sendCookingStockAdd({
          productId: item.productId,
          value: -1 * stockData.quantity,
        });
      }
    }

    await this.saga.kafkaProducerService.emitOrderCreated(payload);
    await this.saga.eventStoreService.saveEvent({
      name: OrderEventNames.orderCreated,
      payload: JSON.stringify(payload),
      objectId: order.id,
    });

    return { orderId: order.id, paymentId: order.paymentId };
  }

  public pay() {
    Logger.error('Заказ не создан');
  }
  public cancel() {
    Logger.error('Заказ не создан');
  }
  public ready() {
    Logger.error('Заказ не создан');
  }
  public complete() {
    Logger.error('Заказ не создан');
  }
}

// Заказ не оплачен
export class CreateOrderPayStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    Logger.error('Заказ уже создан');
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
        eventName: OrderEventNames.orderPayed,
      };

      await this.saga.eventStoreService.saveEvent({
        objectId: order.id,
        payload: JSON.stringify(payload),
        name: OrderEventNames.orderPayed,
      });

      await this.saga.kafkaProducerService.emitOrderUpdated({
        order: {
          id: order.id,
          status: order.status,
        },
        eventName: OrderEventNames.orderPayed,
      });
    }
  }

  public async cancel(orderId: string) {
    const order = await this.saga.eventStoreService.getOrder(orderId);
    if (!order) return;

    order.status = OrderStatus.CANCELED;

    const payload: OrderUpdatedEventPayload = {
      order: {
        id: order.id,
        status: order.status,
      },
      eventName: OrderEventNames.orderCanceled,
    };

    await this.saga.eventStoreService.saveEvent({
      objectId: order.id,
      payload: JSON.stringify(payload),
      name: OrderEventNames.orderCanceled,
    });

    await this.saga.kafkaProducerService.emitOrderUpdated({
      order: {
        id: order.id,
        status: order.status,
      },
      eventName: OrderEventNames.orderCanceled,
    });
  }
  public ready() {
    Logger.error('Заказ не оплачен');
  }
  public complete() {
    Logger.error('Заказ не оплачен');
  }
}

// Заказ не собран
export class CreateOrderMarkReadyStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    Logger.error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload) {
    Logger.error('Заказ уже оплачен');
  }

  public cancel() {
    Logger.error('Заказ не оплачен');
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
      eventName: OrderEventNames.orderReadyForPickup,
    };

    await this.saga.eventStoreService.saveEvent({
      objectId: order.id,
      payload: JSON.stringify(payload),
      name: OrderEventNames.orderReadyForPickup,
    });

    await this.saga.kafkaProducerService.emitOrderUpdated({
      order: {
        id: order.id,
        status: order.status,
      },
      eventName: OrderEventNames.orderReadyForPickup,
    });
  }

  public complete() {
    Logger.error('Заказ не оплачен');
  }
}

// Заказ не выдан
export class CreateOrderMarkCompleteStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    Logger.error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload) {
    Logger.error('Заказ уже оплачен');
  }

  public cancel() {
    Logger.error('Заказ не оплачен');
  }

  public async ready(dto: OrderUpdateCommandRequest) {
    Logger.error('Заказ не оплачен');
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
      eventName: OrderEventNames.orderCompleted,
    };

    await this.saga.eventStoreService.saveEvent({
      objectId: order.id,
      payload: JSON.stringify(payload),
      name: OrderEventNames.orderCompleted,
    });

    await this.saga.kafkaProducerService.emitOrderUpdated({
      order: {
        id: order.id,
        status: order.status,
      },
      eventName: OrderEventNames.orderCompleted,
    });
  }
}

// Заказ не оплачен
export class CreateOrderCanceledStep extends CreateOrderSagaState {
  public saga: CreateOrderSaga;

  public async create(dto: OrderCreateCommandRequest) {
    Logger.error('Заказ уже создан');
  }

  public async pay(data: PaymentStatusUpdatedEventPayload): Promise<void> {
    Logger.error('Заказ уже создан');
  }

  public async cancel(orderId: string) {
    Logger.error('Заказ уже создан');
  }
  public ready() {
    Logger.error('Заказ не оплачен');
  }
  public complete() {
    Logger.error('Заказ не оплачен');
  }
}
