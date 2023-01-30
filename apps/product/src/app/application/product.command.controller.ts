import { ProductCreate } from '@burger-shop/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductCommandService from './product.command.service';

@Controller()
export default class ProductCommandController {
  constructor(private readonly productCommandService: ProductCommandService) {}

  @MessagePattern(ProductCreate.topic)
  public async create(
    @Payload() payload: ProductCreate.Request
  ): Promise<ProductCreate.Response> {
    return this.productCommandService.create(payload);
  }
}
