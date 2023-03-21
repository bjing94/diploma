import {
  MenuCreateCommandRequest,
  MenuCreateCommandResponse,
  MenuCreatedEventPayload,
  MenuDeleteCommandRequest,
  MenuDeleteCommandResponse,
  MenuFindQueryRequest,
  MenuFindQueryResponse,
  MenuGetQueryRequest,
  MenuGetQueryResponse,
  MenuUpdateCommandRequest,
  MenuUpdateCommandResponse,
  MenuUpdatedEventPayload,
  OrderCreateCommandRequest,
  OrderCreateCommandResponse,
  OrderCreatedEventPayload,
  OrderGetQueryRequest,
  OrderGetQueryResponse,
  OrderUpdateCommandRequest,
  OrderUpdateCommandResponse,
  OrderUpdatedEventPayload,
  PaymentCreateCommandRequest,
  PaymentCreateCommandResponse,
  PaymentCreatedEventPayload,
  PaymentUpdateCommandRequest,
  PaymentUpdateCommandResponse,
  PaymentStatusUpdatedEventPayload,
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
  ProductGetMenuItemQueryRequest,
  ProductGetMenuItemQueryResponse,
  ProductUpdatedEventPayload,
  ProductUpdateRequest,
  ProductUpdateResponse,
  PaymentGetQueryRequest,
  PaymentGetQueryResponse,
  CookingRequestCreatedEventPayload,
  CookingRequestUpdatedEventPayload,
  CookingRequestUpdateCommandRequest,
  CookingRequestUpdateCommandResponse,
  CookingRequestCreateCommandRequest,
  CookingRequestCreateCommandResponse,
  CookingStockAddCommandRequest,
  CookingStockAddCommandResponse,
  CookingStockCreatedEventPayload,
  CookingStockUpdatedEventPayload,
  CookingStockGetQueryRequest,
  CookingStockGetQueryResponse,
  CookingRequestGetQueryRequest,
  CookingRequestGetQueryResponse,
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
    for (const topic of this.responseTopics) {
      Logger.log(`Subscribed to response of ${topic}`);
      await this.kafka.subscribeToResponseOf(topic);
    }
    await this.kafka.subscribeToResponseOf('menu-item.get.query');
    await this.kafka.connect();
  }

  public async emit<TResult, TInput>(
    topic: string,
    value: TInput
  ): Promise<void> {
    this.logger.verbose(`Emit ${topic}, value:${JSON.stringify(value)}`);

    await this.kafka.connect();
    await this.kafka.emit<TResult, TInput>(topic, value);
  }

  public async send<TResult, TInput>(
    topic: string,
    value: TInput
  ): Promise<TResult> {
    this.logger.verbose(`Send ${topic}, value:${JSON.stringify(value)}`);

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

  public async emitMenuUpdated(
    payload: MenuUpdatedEventPayload
  ): Promise<void> {
    await this.kafka.emit<void, MenuUpdatedEventPayload>(
      EventTopics.menuUpdated,
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

  public async sendOrderUpdate(
    payload: OrderUpdateCommandRequest
  ): Promise<OrderUpdateCommandResponse> {
    return this.send<OrderUpdateCommandResponse, OrderUpdateCommandRequest>(
      CommandTopics.orderUpdate,
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
    await this.emit<void, OrderCreatedEventPayload>(
      EventTopics.orderCreated,
      payload
    );
  }

  public async emitOrderUpdated(
    payload: OrderUpdatedEventPayload
  ): Promise<void> {
    await this.emit<void, OrderUpdatedEventPayload>(
      EventTopics.orderUpdated,
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

  // Menu
  public async sendMenuItemGet(
    payload: ProductGetMenuItemQueryRequest
  ): Promise<ProductGetMenuItemQueryResponse> {
    return this.send<
      ProductGetMenuItemQueryResponse,
      ProductGetMenuItemQueryRequest
    >(QueryTopics.menuItemGet, payload);
  }

  public async sendMenuFind(
    payload: MenuFindQueryRequest
  ): Promise<MenuFindQueryResponse> {
    return this.send<MenuFindQueryResponse, MenuFindQueryRequest>(
      QueryTopics.menuFind,
      payload
    );
  }

  // Payment
  public async emitPaymentCreated(
    payload: PaymentCreatedEventPayload
  ): Promise<void> {
    await this.emit<void, PaymentCreatedEventPayload>(
      EventTopics.paymentCreated,
      payload
    );
  }

  public async emitPaymentStatusUpdated(
    payload: PaymentStatusUpdatedEventPayload
  ): Promise<void> {
    await this.emit<void, PaymentStatusUpdatedEventPayload>(
      EventTopics.paymentStatusUpdated,
      payload
    );
  }

  public async sendPaymentCreate(
    payload: PaymentCreateCommandRequest
  ): Promise<PaymentCreateCommandResponse> {
    return this.send<PaymentCreateCommandResponse, PaymentCreateCommandRequest>(
      CommandTopics.paymentCreate,
      payload
    );
  }

  public async sendPaymentUpdate(
    payload: PaymentUpdateCommandRequest
  ): Promise<PaymentUpdateCommandResponse> {
    return this.send<PaymentUpdateCommandResponse, PaymentUpdateCommandRequest>(
      CommandTopics.paymentUpdate,
      payload
    );
  }

  public async sendPaymentGet(
    payload: PaymentGetQueryRequest
  ): Promise<PaymentGetQueryResponse> {
    return this.send<PaymentGetQueryResponse, PaymentGetQueryRequest>(
      QueryTopics.paymentGet,
      payload
    );
  }

  // Kitchen
  public async emitCookingRequestCreated(
    payload: CookingRequestCreatedEventPayload
  ) {
    return this.emit<void, CookingRequestCreatedEventPayload>(
      EventTopics.cookingRequestCreated,
      payload
    );
  }

  public async emitCookingRequestUpdated(
    payload: CookingRequestUpdatedEventPayload
  ) {
    return this.emit<void, CookingRequestUpdatedEventPayload>(
      EventTopics.cookingRequestUpdated,
      payload
    );
  }

  public async sendCookingRequestUpdate(
    payload: CookingRequestUpdateCommandRequest
  ) {
    return this.send<
      CookingRequestUpdateCommandResponse,
      CookingRequestUpdateCommandRequest
    >(CommandTopics.cookingRequestUpdate, payload);
  }

  public async sendCookingRequestCreate(
    payload: CookingRequestCreateCommandRequest
  ) {
    return this.send<
      CookingRequestCreateCommandResponse,
      CookingRequestCreateCommandRequest
    >(CommandTopics.cookingRequestCreate, payload);
  }

  public async sendCookingRequestGet(payload: CookingRequestGetQueryRequest) {
    return this.send<
      CookingRequestGetQueryResponse,
      CookingRequestGetQueryRequest
    >(QueryTopics.cookingRequestGet, payload);
  }

  public async sendCookingStockAdd(payload: CookingStockAddCommandRequest) {
    return this.send<
      CookingStockAddCommandResponse,
      CookingStockAddCommandRequest
    >(CommandTopics.cookingStockAdd, payload);
  }

  public async sendCookingStockGet(payload: CookingStockGetQueryRequest) {
    return this.send<CookingStockGetQueryResponse, CookingStockGetQueryRequest>(
      QueryTopics.cookingStockGet,
      payload
    );
  }

  public async emitCookingStockCreated(
    payload: CookingStockCreatedEventPayload
  ) {
    return this.emit<void, CookingStockCreatedEventPayload>(
      EventTopics.cookingStockCreated,
      payload
    );
  }

  public async emitCookingStockUpdated(
    payload: CookingStockUpdatedEventPayload
  ) {
    return this.emit<void, CookingStockUpdatedEventPayload>(
      EventTopics.cookingStockUpdated,
      payload
    );
  }
}
