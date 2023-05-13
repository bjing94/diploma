import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import {
  CommandTopics,
  KafkaLoggerInterceptor,
} from '@burger-shop/kafka-module';
import { UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductCommandService from './product.command.service';

@UseInterceptors(KafkaLoggerInterceptor)
@Controller()
export default class ProductCommandController {
  constructor(private readonly productCommandService: ProductCommandService) {}

  @MessagePattern(CommandTopics.productCreate)
  public async create(
    @Payload() payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    return this.productCommandService.create(payload);
  }

  @MessagePattern(CommandTopics.productUpdate)
  public async update(
    @Payload() payload: ProductUpdateRequest
  ): Promise<ProductUpdateResponse> {
    return this.productCommandService.update(payload);
  }

  @MessagePattern(CommandTopics.menuCreate)
  public async createMenu(
    @Payload() payload: MenuCreateCommandRequest
  ): Promise<MenuCreateCommandResponse> {
    return this.productCommandService.createMenu(payload);
  }

  @MessagePattern(CommandTopics.menuUpdate)
  public async updateMenu(
    @Payload() payload: MenuUpdateCommandRequest
  ): Promise<MenuUpdateCommandResponse> {
    return this.productCommandService.updateMenu(payload);
  }

  @MessagePattern(CommandTopics.menuClearRead)
  public async menuClearRead(): Promise<void> {
    return this.productCommandService.menuClearRead();
  }

  @MessagePattern(CommandTopics.productClearRead)
  public async productClearRead(): Promise<void> {
    return this.productCommandService.productClearRead();
  }
}
