import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { PaymentStatus } from '@burger-shop/interfaces';
import OrderDomainEntity from '../../domain/entity/order.domain-entity';
import { Order } from '../../infrastructure/database/mongo/model/order.model';
import { PaymentInfo } from '../../infrastructure/database/mongo/model/payment-info.model';

export default class OrderMapper {
  public static toDatabase(domain: OrderDomainEntity): Order {
    const order = new Order();
    order.id = domain.getId();
    const paymentInfo = new PaymentInfo();
    order.status = domain.getStatus();
    order.deliveryInfo = null;
    return order;
  }

  public static toDomain(
    order: Order,
    products: { product: ProductDomainEntity; count: number }[]
  ): OrderDomainEntity {
    return new OrderDomainEntity(order.id, products, '2');
  }
}
