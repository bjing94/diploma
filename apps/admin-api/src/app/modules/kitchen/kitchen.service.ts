import {
  CookingRequestFindQueryRequest,
  CookingRequestGetQueryRequest,
  CookingRequestUpdateCommandRequest,
  CookingStockGetQueryRequest,
} from '@burger-shop/contracts';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class KitchenService {
  constructor(private readonly kafka: KafkaProducerService) {}

  public async updateCookingRequest(dto: CookingRequestUpdateCommandRequest) {
    await this.kafka.sendCookingRequestUpdate(dto);
  }

  public async getRequest(dto: CookingRequestGetQueryRequest) {
    return this.kafka.sendCookingRequestGet(dto);
  }

  public async getStock(dto: CookingStockGetQueryRequest) {
    return this.kafka.sendCookingStockGet(dto);
  }

  public async findRequest(dto: CookingRequestFindQueryRequest) {
    return this.kafka.sendCookingRequestFind(dto);
  }

  public async runEvents() {
    return this.kafka.sendKitchenRunEvents();
  }
}
