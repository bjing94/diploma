import {
  CookingRequestCreatedEventPayload,
  CookingRequestGetQueryRequest,
  CookingRequestUpdatedEventPayload,
  CookingStockCreatedEventPayload,
  CookingStockGetQueryRequest,
  CookingStockUpdatedEventPayload,
} from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import CookingRequestRepository from '../infrastructure/repository/cooking-request.repository';
import CookingStockRepository from '../infrastructure/repository/cooking-stock.repository';

@Injectable()
export default class KitchenQueryService {
  constructor(
    @Inject('CookingRequestRepository')
    private readonly requestRepository: CookingRequestRepository,
    @Inject('CookingStockRepository')
    private readonly stockRepository: CookingStockRepository
  ) {}

  public async onCookingRequestCreated(
    data: CookingRequestCreatedEventPayload
  ) {
    return this.requestRepository.create(data);
  }

  public async onCookingRequestUpdated(
    data: CookingRequestUpdatedEventPayload
  ) {
    return this.requestRepository.update(data);
  }

  public async getCookingRequest(data: CookingRequestGetQueryRequest) {
    try {
      const res = await this.requestRepository.findOne({ _id: data.id });
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async onCookingStockCreated(data: CookingStockCreatedEventPayload) {
    return this.stockRepository.create(data);
  }

  public async onCookingStockUpdated(data: CookingStockUpdatedEventPayload) {
    return this.stockRepository.update(data);
  }

  public async getCookingStock(data: CookingStockGetQueryRequest) {
    try {
      const res = await this.stockRepository.findOne({ _id: data.id });
      return res;
    } catch (e) {
      return null;
    }
  }
}
