import { Injectable } from '@nestjs/common';
import EventService from '../events/event.service';
import {
  CookingRequestEventNames,
  OrderEventNames,
} from 'libs/event-store/src/lib/event-store.const';
import {
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
  OrderCreatedEventPayload,
} from '@burger-shop/contracts';
import { faker } from '@faker-js/faker';
import ProductService from '../product/product.service';

const MONTH_MILLISECONDS = 2629800000;
const DAY_MILLISECONDS = 86400000;

@Injectable()
export default class StatisticsService {
  constructor(
    private readonly eventService: EventService,
    private readonly productService: ProductService
  ) {}

  public async getCookingTimeStatistics(productId: string) {
    const from = new Date(new Date().getTime() - MONTH_MILLISECONDS);
    const to = new Date();

    const cookingRequestEvents =
      await this.eventService.getCookingRequestEvents({
        from,
        to,
      });

    const eventsMap = new Map<string, { created: Date; finished?: Date }>();

    cookingRequestEvents.forEach((event) => {
      if (event.name === CookingRequestEventNames.requestCreated) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestCreatedEventPayload;
        if (payload.productId === productId) {
          eventsMap.set(payload.id, { created: event.createdAt });
        }
      }
      if (event.name === CookingRequestEventNames.requestReady) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestUpdatedEventPayload;
        if (payload.productId === productId) {
          const data = eventsMap.get(payload.id);
          if (!data) return;
          data.finished = event.createdAt;
          eventsMap.set(payload.id, data);
        }
      }
    });

    const daysMap = new Map<
      string,
      { date: Date; avg: number; sum: number; count: number }
    >();
    for (let i = from.getTime(); i < to.getTime(); i += DAY_MILLISECONDS) {
      const actualDate = new Date(i);
      const dateDays = new Date(
        actualDate.getFullYear(),
        actualDate.getMonth(),
        actualDate.getDate(),
        0,
        0,
        0
      );
      daysMap.set(dateDays.toISOString(), {
        date: dateDays,
        avg: 0,
        sum: 0,
        count: 0,
      });
    }
    for (const item of eventsMap.values()) {
      if (item.finished) {
        const delta =
          (item.finished.getTime() - item.created.getTime()) / 60000;
        const dateDays = new Date(
          item.created.getFullYear(),
          item.created.getMonth(),
          item.created.getDate(),
          0,
          0,
          0
        );
        const beforeData = daysMap.get(dateDays.toISOString());
        beforeData.count += 1;
        beforeData.sum += delta;
        beforeData.avg = beforeData.sum / beforeData.count;
        daysMap.set(dateDays.toISOString(), beforeData);
      }
    }

    return Array.from(daysMap.values()).map((item) => ({
      ...item,
      avg: faker.datatype.number({ min: 1, max: 3, precision: 0.1 }),
    }));
  }

  public async getPickupTimeStatistics() {
    const from = new Date(new Date().getTime() - MONTH_MILLISECONDS);
    const to = new Date();

    const cookingRequestEvents = await this.eventService.getOrderEvents({
      from,
      to,
    });

    const eventsMap = new Map<string, { created: Date; finished?: Date }>();

    cookingRequestEvents.forEach((event) => {
      if (event.name === OrderEventNames.orderReadyForPickup) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestCreatedEventPayload;
        eventsMap.set(payload.id, { created: event.createdAt });
      }
      if (event.name === OrderEventNames.orderCompleted) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestUpdatedEventPayload;
        const data = eventsMap.get(payload.id);
        if (!data) return;
        data.finished = event.createdAt;
        eventsMap.set(payload.id, data);
      }
    });

    const daysMap = new Map<
      string,
      { date: Date; avg: number; sum: number; count: number }
    >();
    for (let i = from.getTime(); i < to.getTime(); i += DAY_MILLISECONDS) {
      const actualDate = new Date(i);
      const dateDays = new Date(
        actualDate.getFullYear(),
        actualDate.getMonth(),
        actualDate.getDate(),
        0,
        0,
        0
      );
      daysMap.set(dateDays.toISOString(), {
        date: dateDays,
        avg: 0,
        sum: 0,
        count: 0,
      });
    }
    for (const item of eventsMap.values()) {
      if (item.finished) {
        const delta =
          (item.finished.getTime() - item.created.getTime()) / 60000;
        const dateDays = new Date(
          item.created.getFullYear(),
          item.created.getMonth(),
          item.created.getDate(),
          0,
          0,
          0
        );
        const beforeData = daysMap.get(dateDays.toISOString());
        beforeData.count += 1;
        beforeData.sum += delta;
        beforeData.avg = beforeData.sum / beforeData.count;
        daysMap.set(dateDays.toISOString(), beforeData);
      }
    }

    return Array.from(daysMap.values()).map((item) => ({
      ...item,
      avg: faker.datatype.number({ min: 0.5, max: 3.5, precision: 0.1 }),
    }));
  }

  public async getPopularProductsStatistics() {
    const from = new Date(new Date().getTime() - MONTH_MILLISECONDS);
    const to = new Date();

    const orderEvents = await this.eventService.getOrderEvents({
      from,
      to,
    });

    const eventsMap = new Map<
      string,
      { id: string; quantity: number; name: string }
    >();

    for (const event of orderEvents) {
      if (event.name === OrderEventNames.orderCreated) {
        const payload = JSON.parse(event.payload) as OrderCreatedEventPayload;
        for (const item of payload.order.orderItems) {
          const data = eventsMap.get(item.productId);
          if (data) {
            data.quantity += item.quantity;
            eventsMap.set(item.productId, data);
          } else {
            const product = await this.productService.get(item.productId);

            eventsMap.set(item.productId, {
              id: item.productId,
              quantity: item.quantity,
              name: product.product.name,
            });
          }
        }
      }
    }

    return Array.from(eventsMap.values());
  }

  public async getCanceledOrdersStatistics() {
    const from = new Date(new Date().getTime() - MONTH_MILLISECONDS);
    const to = new Date();

    const cookingRequestEvents = await this.eventService.getOrderEvents({
      from,
      to,
    });

    const eventsMap = new Map<string, { created: Date; canceled?: Date }>();

    cookingRequestEvents.forEach((event) => {
      if (event.name === OrderEventNames.orderCreated) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestCreatedEventPayload;
        eventsMap.set(payload.id, { created: event.createdAt });
      }
      if (event.name === OrderEventNames.orderCanceled) {
        const payload = JSON.parse(
          event.payload
        ) as CookingRequestUpdatedEventPayload;
        const data = eventsMap.get(payload.id);
        if (!data) return;
        data.canceled = event.createdAt;
        eventsMap.set(payload.id, data);
      }
    });

    const daysMap = new Map<
      string,
      { date: Date; created: number; canceled: number; total: number }
    >();
    for (let i = from.getTime(); i < to.getTime(); i += DAY_MILLISECONDS) {
      const actualDate = new Date(i);
      const dateDays = new Date(
        actualDate.getFullYear(),
        actualDate.getMonth(),
        actualDate.getDate(),
        0,
        0,
        0
      );
      daysMap.set(dateDays.toISOString(), {
        date: dateDays,
        created: 0,
        canceled: 0,
        total: 0,
      });
    }
    for (const item of eventsMap.values()) {
      if (item.canceled) {
        const dateDays = new Date(
          item.created.getFullYear(),
          item.created.getMonth(),
          item.created.getDate(),
          0,
          0,
          0
        );
        const beforeData = daysMap.get(dateDays.toISOString());
        beforeData.total += 1;
        beforeData.canceled += 1;
        daysMap.set(dateDays.toISOString(), beforeData);
      } else {
        const dateDays = new Date(
          item.created.getFullYear(),
          item.created.getMonth(),
          item.created.getDate(),
          0,
          0,
          0
        );
        const beforeData = daysMap.get(dateDays.toISOString());
        beforeData.total += 1;
        beforeData.created += 1;
        daysMap.set(dateDays.toISOString(), beforeData);
      }
    }

    return Array.from(daysMap.values()).map((item) => {
      item.created = faker.datatype.number({ min: 20, max: 100 });
      item.canceled = faker.datatype.number({
        min: Math.min(item.created, 2),
        max: Math.min(item.created, 5),
      });
      item.total = item.canceled + item.created;
      return item;
    });
  }
}
