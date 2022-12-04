import { Inject, Injectable } from '@nestjs/common';
import { OrderCreate } from '@burger-shop/contracts';
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
    const obj = new OrderDomainEntity(generateOrderId(), []);
    orderData[id] = obj;

    // Save event to tree
    // Dispatch event to topic order.created.event
    return {
      orderId: obj.getId(),
    };
  }
}
