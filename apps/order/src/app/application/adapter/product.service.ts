import {
  ProductGetByIdQueryRequest,
  ProductGetByIdQueryResponse,
} from '@burger-shop/contracts';
import { QueryTopics } from '@burger-shop/kafka-module';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export default class ProductAdapterService {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  onModuleInit() {
    this.kafka.subscribeToResponseOf(QueryTopics.productGet);
  }
  async getProduct(id: string): Promise<ProductGetByIdQueryResponse> {
    return lastValueFrom(
      this.kafka.send<ProductGetByIdQueryResponse, ProductGetByIdQueryRequest>(
        QueryTopics.productGet,
        {
          id,
        }
      )
    );
  }
}
