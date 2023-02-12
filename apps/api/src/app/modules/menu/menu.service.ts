import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  ProductGetMenuItemQueryRequest,
  ProductGetMenuItemQueryResponse,
} from '@burger-shop/contracts';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { kafkaConfig } from '../../config/provide-kafka-config';

@Injectable()
export default class MenuService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  public async create(
    dto: MenuCreateCommandRequest
  ): Promise<MenuCreateCommandResponse> {
    return this.kafkaProducerService.sendMenuCreate(dto);
  }

  public async getMenu(
    dto: MenuGetQueryRequest
  ): Promise<MenuGetQueryResponse> {
    return this.kafkaProducerService.sendMenuGet(dto);
  }

  public async getMenuItem(
    dto: ProductGetMenuItemQueryRequest
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.kafkaProducerService.sendMenuItemGet(dto);
  }
}
