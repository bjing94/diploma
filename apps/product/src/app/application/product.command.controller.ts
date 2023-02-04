import {
  ProductCreateRequest,
  ProductCreateResponse,
} from '@burger-shop/contracts';
import { CommandTopics } from '@burger-shop/kafka-module';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductCommandService from './product.command.service';

@Controller()
export default class ProductCommandController {
  constructor(private readonly productCommandService: ProductCommandService) {}

  @MessagePattern(CommandTopics.productCreate)
  public async create(
    @Payload() payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    return this.productCommandService.create(payload);
  }
}
