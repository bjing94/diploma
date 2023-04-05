import {
  CookingRequestCreatedEventPayload,
  CookingRequestUpdateCommandRequest,
  CookingRequestUpdatedEventPayload,
  CookingStockAddCommandRequest,
  CookingStockCreatedEventPayload,
  CookingStockUpdatedEventPayload,
  OrderCreatedEventPayload,
} from '@burger-shop/contracts';
import {
  CookingRequestDomainEntity,
  CookingStockDomainEntity,
} from '@burger-shop/domain-entity';
import { EventStoreKitchenService } from '@burger-shop/event-store';
import { CookingRequestStatus } from '@burger-shop/interfaces';
import { EventTopics, KafkaProducerService } from '@burger-shop/kafka-module';
import { Inject, Injectable, Logger } from '@nestjs/common';
import CookingRequestRepository from '../infrastructure/repository/cooking-request.repository';
import CookingStockRepository from '../infrastructure/repository/cooking-stock.repository';

@Injectable()
export default class KitchenCommandService {
  constructor(
    private readonly eventStore: EventStoreKitchenService,
    private readonly kafkaService: KafkaProducerService,
    @Inject('CookingRequestRepository')
    private readonly requestRepository: CookingRequestRepository,
    @Inject('CookingStockRepository')
    private readonly stockRepository: CookingStockRepository
  ) {}

  public async updateCookingRequest(data: CookingRequestUpdateCommandRequest) {
    const cookingRequest = await this.eventStore.getCookingRequest(data.id);
    if (!cookingRequest) return null;

    cookingRequest.status = data.status;

    const payload: CookingRequestUpdatedEventPayload = {
      id: cookingRequest.id,
      productId: cookingRequest.productId,
      status: cookingRequest.status,
    };

    await this.eventStore.saveCookingRequestEvent({
      name: EventTopics.cookingRequestUpdated,
      payload: JSON.stringify(payload),
      objectId: cookingRequest.id,
    });
    await this.kafkaService.emitCookingRequestUpdated(payload);

    if (cookingRequest.status === CookingRequestStatus.READY) {
      await this.handleAddStock({
        productId: cookingRequest.productId,
        value: 1,
      });
    }
  }

  public async handleOrderCreated(data: OrderCreatedEventPayload) {
    const cookingRequests: CookingRequestDomainEntity[] = [];

    for (const item of data.order.orderItems) {
      const stockData = await this.eventStore.getCookingStock(item.productId);
      const missing = stockData?.quantity
        ? item.quantity - stockData.quantity
        : item.quantity;
      Logger.log(
        `Stock ${item.productId} ${stockData?.quantity}, missing ${missing}`
      );
      for (let i = 0; i < missing; i++) {
        cookingRequests.push(
          new CookingRequestDomainEntity({
            productId: item.productId,
            status: CookingRequestStatus.PENDING,
          })
        );
      }

      if (missing > 0 && stockData?.quantity > 0) {
        await this.handleAddStock({
          productId: item.productId,
          value: -1 * stockData.quantity,
        });
      }
    }

    for (const req of cookingRequests) {
      const payload: CookingRequestCreatedEventPayload = {
        id: req.id,
        productId: req.productId,
        status: req.status,
      };
      await this.eventStore.saveCookingRequestEvent({
        objectId: req.id,
        payload: JSON.stringify(payload),
        name: EventTopics.cookingRequestCreated,
      });
      await this.kafkaService.emitCookingRequestCreated(payload);
    }
  }

  public async handleAddStock(data: CookingStockAddCommandRequest) {
    let stock = await this.eventStore.getCookingStock(data.productId);
    if (!stock) {
      await this.handleCreateStock(data);
    }

    stock = await this.eventStore.getCookingStock(data.productId);
    stock.quantity += data.value;

    const payload: CookingStockUpdatedEventPayload = {
      id: stock.id,
      quantity: stock.quantity,
    };
    // Привязка по id товара
    await this.eventStore.saveCookingStockEvent({
      name: EventTopics.cookingStockUpdated,
      payload: JSON.stringify(payload),
      objectId: stock.id,
    });

    await this.kafkaService.emitCookingStockUpdated(payload);
  }

  private async handleCreateStock(data: CookingStockAddCommandRequest) {
    const domainStock = new CookingStockDomainEntity({
      id: data.productId,
      productId: data.productId,
      quantity: 1,
    });
    const payload: CookingStockCreatedEventPayload = {
      id: domainStock.id,
      productId: domainStock.productId,
      quantity: domainStock.quantity,
    };
    // Привязка по id товара
    await this.eventStore.saveCookingStockEvent({
      name: EventTopics.cookingStockCreated,
      payload: JSON.stringify(payload),
      objectId: domainStock.id,
    });

    await this.kafkaService.emitCookingStockCreated(payload);
  }

  public async runKitchenEvents() {
    try {
      await this.requestRepository.clearAll();
      await this.stockRepository.clearAll();
      const stockEvents = await this.eventStore.getCookingStockEvents({});
      const cookingEvents = await this.eventStore.getCookingRequestEvents({});
      const events = [...stockEvents, ...cookingEvents];
      console.log(`Events:`, events.length);
      for (const event of events) {
        await new Promise((res, rej) => {
          setTimeout(() => {
            res(true);
          }, 200);
        });
        await this.kafkaService.emit(event.name, event.payload);
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
