import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuFindQueryRequest,
  MenuFindQueryResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  ProductGetMenuItemQueryRequest,
  ProductGetMenuItemQueryResponse,
} from '@burger-shop/contracts';
import { KafkaProducerService } from '@burger-shop/kafka-module';
import { Injectable } from '@nestjs/common';

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

  public async findMenu(
    dto: MenuFindQueryRequest
  ): Promise<MenuFindQueryResponse> {
    return this.kafkaProducerService.sendMenuFind(dto);
  }

  public async getMenuItem(
    dto: ProductGetMenuItemQueryRequest
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.kafkaProducerService.sendMenuItemGet(dto);
  }

  public async updateMenu(
    dto: MenuUpdateCommandRequest
  ): Promise<MenuUpdateCommandResponse> {
    return this.kafkaProducerService.sendMenuUpdate(dto);
  }
}
