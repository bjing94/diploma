import { Inject, Injectable } from '@nestjs/common';
import { OrderCreate, OrderCreated } from '@burger-shop/contracts';
import OrderDomainEntity from '../domain/entity/order.domain-entity';
import { ClientProxy } from '@nestjs/microservices';
import { generateOrderId } from './helper/generate-order-id';
import OrderEventSourceRepositoryProvider from './providers/order.event-source.repository-provider';

const orderData = {};

@Injectable()
export default class OrderCommandService {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientProxy) {}

  public create(dto: OrderCreate.Request): OrderCreate.Response {
    console.log('Creating order', dto);
    const id = generateOrderId();
    const obj = new OrderDomainEntity(
      generateOrderId(),
      [],
      dto.paymentInfo,
      dto.deliveryInfo
    );
    orderData[id] = obj;

    // Dispatch event to topic order.created.event
    this.kafka.emit<void, OrderCreated.Payload>(OrderCreated.topic, {
      id: obj.getId(),
      status: obj.getStatus(),
      orderItems: obj.getOrderItems().map((item) => {
        return {
          count: item.getCount(),
          foodId: item.getProduct().id,
        };
      }),
      createdAt: new Date(),
    });
    return {
      orderId: obj.getId(),
    };
  }
}
