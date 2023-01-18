import { ProductCreate } from '@burger-shop/contracts';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductCommandService from './product.command.service';

export default class ProductCommandController {
  constructor(private readonly productCommandService: ProductCommandService) {}

  @MessagePattern(ProductCreate.topic)
  public async create(
    @Payload() payload: ProductCreate.Request
  ): Promise<ProductCreate.Response> {
    return this.productCommandService;
  }
}
