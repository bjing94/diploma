import {
  ProductCreated,
  ProductDeleted,
  ProductFind,
  ProductGetById,
  ProductUpdated,
} from '@burger-shop/contracts';
import { MessagePattern, Payload } from '@nestjs/microservices';
import ProductQueryService from './product.query.service';

export default class ProductQueryController {
  constructor(private readonly productQueryService: ProductQueryService) {}

  @MessagePattern(ProductGetById.topic)
  public async getProductById(
    @Payload() payload: ProductGetById.Request
  ): Promise<ProductGetById.Response> {
    return this.productQueryService.getById(payload.id);
  }

  @MessagePattern(ProductFind.topic)
  public async find(
    @Payload() payload: ProductFind.Request
  ): Promise<ProductFind.Response> {
    return this.productQueryService.find(payload);
  }

  @MessagePattern(ProductCreated.topic)
  public async onProductCreated(
    @Payload() payload: ProductCreated.Payload
  ): Promise<void> {
    return this.productQueryService.onCreated(payload);
  }

  @MessagePattern(ProductUpdated.topic)
  public async onProductUpdated(
    @Payload() payload: ProductUpdated.Payload
  ): Promise<void> {
    return this.productQueryService.onUpdated(payload);
  }

  @MessagePattern(ProductDeleted.topic)
  public async onProductDeleted(
    @Payload() payload: ProductDeleted.Payload
  ): Promise<void> {
    return this.productQueryService.onDeleted(payload);
  }
}
