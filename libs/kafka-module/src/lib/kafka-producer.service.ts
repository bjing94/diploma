import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuCreatedEventPayload,
  MenuDeleteCommandRequest,
  MenuDeleteCommandResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  OrderCompleteCommandRequest,
  OrderCompleteCommandResponse,
  OrderCompletedEventPayload,
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedEventPayload,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderPayCommandRequest,
  OrderPayCommandResponse,
  OrderPayedEventPayload,
  ProductCreatedEventPayload,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductDeletedEventPayload,
  ProductDeleteRequest,
  ProductDeleteResponse,
  ProductFindQueryRequest,
  ProductFindQueryResponse,
  ProductGetByIdQueryRequest,
  ProductGetByIdQueryResponse,
  ProductUpdatedEventPayload,
  ProductUpdateRequest,
  ProductUpdateResponse,
} from '@burger-shop/contracts';
import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { CommandTopics, EventTopics, QueryTopics } from './kafka.topics.enum';

@Injectable()
export class KafkaProducerService {
  private logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
    @Inject('RESPONSE_TOPICS') private readonly responseTopics: string[]
  ) {}

  async onModuleInit() {
    await this.kafka.subscribeToResponseOf('product.create.command');
    console.log(JSON.stringify(this.kafka));
  }

  public async emit<TResult, TInput>(
    topic: string,
    value: TInput
  ): Promise<Observable<TResult>> {
    this.logger.verbose(`Emit ${topic}, value:${JSON.stringify(value)}`);

    await this.kafka.connect();
    return this.kafka.emit<TResult, TInput>(topic, value);
  }

  public async send<TResult, TInput>(
    topic: string,
    value: TInput
  ): Promise<TResult> {
    this.logger.verbose(`Emit ${topic}, value:${JSON.stringify(value)}`);

    await this.kafka.connect();
    const result = await lastValueFrom(
      this.kafka.send<TResult, TInput>(topic, value)
    );
    return result;
  }

  public async getClient() {
    return this.kafka;
  }

  // Product service

  public async emitProductCreated(
    payload: ProductCreatedEventPayload
  ): Promise<void> {
    await this.kafka.emit<void, ProductCreatedEventPayload>(
      EventTopics.productCreated,
      payload
    );
  }

  public async emitProductUpdated(
    payload: ProductUpdatedEventPayload
  ): Promise<void> {
    await this.kafka.emit<void, ProductUpdatedEventPayload>(
      EventTopics.productUpdated,
      payload
    );
  }

  public async emitProductDeleted(
    payload: ProductDeletedEventPayload
  ): Promise<void> {
    await this.kafka.emit<void, ProductDeletedEventPayload>(
      EventTopics.productDeleted,
      payload
    );
  }

  public async emitMenuCreated(
    payload: MenuCreatedEventPayload
  ): Promise<void> {
    await this.kafka.emit<void, MenuCreatedEventPayload>(
      EventTopics.menuCreated,
      payload
    );
  }

  public async sendProductCreate(
    payload: ProductCreateRequest
  ): Promise<ProductCreateResponse> {
    return this.send<ProductCreateResponse, ProductCreateRequest>(
      CommandTopics.productCreate,
      payload
    );
  }

  public async sendProductDelete(
    payload: ProductDeleteRequest
  ): Promise<ProductDeleteResponse> {
    return this.send<ProductDeleteResponse, ProductDeleteRequest>(
      CommandTopics.productDelete,
      payload
    );
  }

  public async sendProductUpdate(
    payload: ProductUpdateRequest
  ): Promise<ProductUpdateResponse> {
    return this.send<ProductUpdateResponse, ProductUpdateRequest>(
      CommandTopics.productUpdate,
      payload
    );
  }

  public async sendMenuCreate(
    payload: MenuCreateCommandRequest
  ): Promise<MenuCreateCommandResponse> {
    return this.send<MenuCreateCommandResponse, MenuCreateCommandRequest>(
      CommandTopics.menuCreate,
      payload
    );
  }

  public async sendMenuDelete(
    payload: MenuDeleteCommandRequest
  ): Promise<MenuDeleteCommandResponse> {
    return this.send<MenuDeleteCommandResponse, MenuDeleteCommandRequest>(
      CommandTopics.menuDelete,
      payload
    );
  }

  public async sendMenuUpdate(
    payload: MenuUpdateCommandRequest
  ): Promise<MenuUpdateCommandResponse> {
    return this.send<MenuUpdateCommandResponse, MenuUpdateCommandRequest>(
      CommandTopics.menuUpdate,
      payload
    );
  }

  public async sendMenuGet(
    payload: MenuGetQueryRequest
  ): Promise<MenuGetQueryResponse> {
    return this.send<MenuGetQueryResponse, MenuGetQueryRequest>(
      QueryTopics.menuGet,
      payload
    );
  }

  public async sendProductFind(
    payload: ProductFindQueryRequest
  ): Promise<ProductFindQueryResponse> {
    return this.send<ProductFindQueryResponse, ProductFindQueryRequest>(
      QueryTopics.productFind,
      payload
    );
  }

  public async sendProductGet(
    payload: ProductGetByIdQueryRequest
  ): Promise<ProductGetByIdQueryResponse> {
    return this.send<ProductGetByIdQueryResponse, ProductGetByIdQueryRequest>(
      QueryTopics.productGet,
      payload
    );
  }

  // Order service
  public async sendOrderComplete(
    payload: OrderCompleteCommandRequest
  ): Promise<OrderCompleteCommandResponse> {
    return this.send<OrderCompleteCommandResponse, OrderCompleteCommandRequest>(
      CommandTopics.orderComplete,
      payload
    );
  }

  public async sendOrderPay(
    payload: OrderPayCommandRequest
  ): Promise<OrderPayCommandResponse> {
    return this.send<OrderPayCommandResponse, OrderPayCommandRequest>(
      CommandTopics.orderPay,
      payload
    );
  }

  public async sendOrderCreate(
    payload: OrderCreateCommandRequest
  ): Promise<OrderCreateCommandResponse> {
    return this.send<OrderCreateCommandResponse, OrderCreateCommandRequest>(
      CommandTopics.orderCreate,
      payload
    );
  }

  public async emitOrderCreated(
    payload: OrderCreatedEventPayload
  ): Promise<void> {
    return this.send<void, OrderCreatedEventPayload>(
      EventTopics.orderCreated,
      payload
    );
  }

  public async emitOrderPayed(payload: OrderPayedEventPayload): Promise<void> {
    return this.send<void, OrderPayedEventPayload>(
      EventTopics.orderPayed,
      payload
    );
  }

  public async emitOrderCompleted(
    payload: OrderCompletedEventPayload
  ): Promise<void> {
    return this.send<void, OrderCompletedEventPayload>(
      EventTopics.orderCompleted,
      payload
    );
  }

  public async sendOrderGet(
    payload: OrderGetQueryRequest
  ): Promise<OrderGetQueryResponse> {
    return this.send<OrderGetQueryResponse, OrderGetQueryRequest>(
      QueryTopics.orderGet,
      payload
    );
  }
}
