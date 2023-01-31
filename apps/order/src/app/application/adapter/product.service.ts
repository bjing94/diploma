import { ProductGetById } from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export default class ProductAdapterService {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  onModuleInit() {
    this.kafka.subscribeToResponseOf(ProductGetById.topic);
  }
  async getProduct(id: number): Promise<ProductGetById.Response> {
    return lastValueFrom(
      this.kafka.send<ProductGetById.Response, ProductGetById.Request>(
        ProductGetById.topic,
        {
          id,
        }
      )
    );
  }
}
