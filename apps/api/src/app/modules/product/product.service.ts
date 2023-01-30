import {
  OrderCreate,
  OrderGetOrder,
  OrderPay,
  ProductCreate,
  ProductDelete,
  ProductUpdate,
} from '@burger-shop/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { kafkaConfig } from '../../config/provide-kafka-config';

@Injectable()
export default class ProductService {
  constructor(
    @Inject(kafkaConfig.clientName) private readonly kafkaClient: ClientKafka
  ) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(ProductCreate.topic);
    this.kafkaClient.subscribeToResponseOf(ProductUpdate.topic);
    this.kafkaClient.subscribeToResponseOf(ProductDelete.topic);
  }

  public async create(dto: ProductCreate.Request) {
    return lastValueFrom(
      this.kafkaClient.send<ProductCreate.Response, ProductCreate.Request>(
        ProductCreate.topic,
        dto
      )
    );
  }

  //   public async get(id: string) {
  //     return lastValueFrom(
  //       this.kafkaClient.send<OrderGetOrder.Response, OrderGetOrder.Request>(
  //         OrderGetOrder.topic,
  //         { id }
  //       )
  //     );
  //   }

  //   public async pay(id: string) {
  //     return lastValueFrom(
  //       this.kafkaClient.send<OrderPay.Response, OrderPay.Request>(
  //         OrderPay.topic,
  //         { orderId: id }
  //       )
  //     );
  //   }
}
