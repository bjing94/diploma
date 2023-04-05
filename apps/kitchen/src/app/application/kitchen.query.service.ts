import {
  CookingRequestCreatedEventPayload,
  CookingRequestFindQueryRequest,
  CookingRequestFindQueryResponse,
  CookingRequestGetQueryRequest,
  CookingRequestGetQueryResponse,
  CookingRequestUpdatedEventPayload,
  CookingStockCreatedEventPayload,
  CookingStockGetQueryRequest,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import CookingRequestRepository from '../infrastructure/repository/cooking-request.repository';
import CookingStockRepository from '../infrastructure/repository/cooking-stock.repository';
import { isObjectIdOrHexString } from 'mongoose';

@Injectable()
export default class KitchenQueryService {
  constructor(
    @Inject('CookingRequestRepository')
    private readonly requestRepository: CookingRequestRepository,
    @Inject('CookingStockRepository')
    private readonly stockRepository: CookingStockRepository,
    private readonly kafkaService: KafkaProducerService
  ) {}

  public async onCookingRequestCreated(
    data: CookingRequestCreatedEventPayload
  ) {
    if (!isObjectIdOrHexString(data.id)) return null;
    return this.requestRepository.create(data);
  }

  public async onCookingRequestUpdated(
    data: CookingRequestUpdatedEventPayload
  ) {
    if (!isObjectIdOrHexString(data.id)) return null;
    return this.requestRepository.update(data);
  }

  public async getCookingRequest(
    data: CookingRequestGetQueryRequest
  ): Promise<CookingRequestGetQueryResponse> {
    if (!isObjectIdOrHexString(data.id)) return null;
    try {
      const res = await this.requestRepository.findOne({ _id: data.id });
      const response = await this.kafkaService.sendProductGet({
        id: res.productId,
      });
      return {
        id: res.id,
        product: response.product,
        status: res.status,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async onCookingStockCreated(data: CookingStockCreatedEventPayload) {
    if (!isObjectIdOrHexString(data.id)) return null;
    return this.stockRepository.create(data);
  }

  public async onCookingStockUpdated(data: CookingStockUpdatedEventPayload) {
    if (!isObjectIdOrHexString(data.id)) return null;
    return this.stockRepository.update(data);
  }

  public async getCookingStock(data: CookingStockGetQueryRequest) {
    if (!isObjectIdOrHexString(data.id)) return null;
    try {
      const res = await this.stockRepository.findOne({ _id: data.id });
      return res;
    } catch (e) {
      return null;
    }
  }

  public async findCookingRequest(
    data: CookingRequestFindQueryRequest
  ): Promise<CookingRequestFindQueryResponse> {
    try {
      const res = await this.requestRepository.findMany({
        status: data.status,
      });
      const response = await this.kafkaService.sendProductFind({
        ids: res.map((item) => item.productId),
        take: res.length,
        skip: 0,
      });
      const productsMap = new Map();
      response.products.forEach((element) => {
        productsMap.set(element.id, element);
      });
      return {
        requests: res.map((item) => {
          return {
            id: item.id,
            status: item.status,
            product: productsMap.get(item.productId) ?? null,
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
      return { requests: [] };
    }
  }
}
