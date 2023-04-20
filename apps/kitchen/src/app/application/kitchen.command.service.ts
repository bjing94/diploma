import {
  CookingRequestCreateCommandRequest,
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
import {
  CookingRequestEventNames,
  CookingStockEventNames,
  EventStoreKitchenService,
} from '@burger-shop/event-store';
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

  public async createCookingRequest(data: CookingRequestCreateCommandRequest) {
    const entity = new CookingRequestDomainEntity({
      productId: data.productId,
      status: CookingRequestStatus.PENDING,
    });

    const payload: CookingRequestCreatedEventPayload = {
      id: entity.id,
      productId: entity.productId,
      status: entity.status,
      eventName: CookingRequestEventNames.requestCreated,
    };
    await this.eventStore.saveCookingRequestEvent({
      objectId: entity.id,
      payload: JSON.stringify(payload),
      name: EventTopics.cookingRequestCreated,
    });
    await this.kafkaService.emitCookingRequestCreated(payload);
  }

  public async updateCookingRequest(data: CookingRequestUpdateCommandRequest) {
    console.log(data);
    const cookingRequest = await this.eventStore.getCookingRequest(data.id);
    if (!cookingRequest) return null;

    if (data.status === CookingRequestStatus.READY) {
      await this.readyCookingRequest(data);
    }
    if (data.status === CookingRequestStatus.REJECTED) {
      await this.rejectCookingRequest(data);
    }
  }

  private async readyCookingRequest(data: CookingRequestUpdateCommandRequest) {
    const cookingRequest = await this.eventStore.getCookingRequest(data.id);
    if (!cookingRequest) return null;

    cookingRequest.status = data.status;

    const payload: CookingRequestUpdatedEventPayload = {
      id: cookingRequest.id,
      productId: cookingRequest.productId,
      status: cookingRequest.status,
      eventName: CookingRequestEventNames.requestReady,
    };
    console.log('ready request', payload);
    await this.eventStore.saveCookingRequestEvent({
      name: CookingRequestEventNames.requestReady,
      payload: JSON.stringify(payload),
      objectId: cookingRequest.id,
    });
    await this.kafkaService.emitCookingRequestUpdated(payload);

    await this.handleAddStock({
      productId: cookingRequest.productId,
      value: 1,
    });
  }

  private async rejectCookingRequest(data: CookingRequestUpdateCommandRequest) {
    const cookingRequest = await this.eventStore.getCookingRequest(data.id);
    if (!cookingRequest) return null;

    cookingRequest.status = data.status;

    const payload: CookingRequestUpdatedEventPayload = {
      id: cookingRequest.id,
      productId: cookingRequest.productId,
      status: cookingRequest.status,
      eventName: CookingRequestEventNames.requestRejected,
    };

    await this.eventStore.saveCookingRequestEvent({
      name: CookingRequestEventNames.requestRejected,
      payload: JSON.stringify(payload),
      objectId: cookingRequest.id,
    });
    await this.kafkaService.emitCookingRequestUpdated(payload);
  }

  // Deprecated
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
        eventName: CookingRequestEventNames.requestCreated,
      };
      await this.eventStore.saveCookingRequestEvent({
        objectId: req.id,
        payload: JSON.stringify(payload),
        name: CookingRequestEventNames.requestCreated,
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
      eventName: CookingStockEventNames.stockQuantityChanged,
    };
    // Привязка по id товара
    await this.eventStore.saveCookingStockEvent({
      name: CookingStockEventNames.stockQuantityChanged,
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
      eventName: CookingStockEventNames.stockCreated,
    };
    // Привязка по id товара
    await this.eventStore.saveCookingStockEvent({
      name: CookingStockEventNames.stockCreated,
      payload: JSON.stringify(payload),
      objectId: domainStock.id,
    });

    await this.kafkaService.emitCookingStockCreated(payload);
  }

  async kitchenClearRead() {
    await this.requestRepository.clearAll();
    await this.stockRepository.clearAll();
  }
}
