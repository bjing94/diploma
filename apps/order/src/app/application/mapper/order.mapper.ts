import { ProductDomainEntity } from '@burger-shop/domain-entities';
import { PaymentStatus } from '@burger-shop/interfaces';
import OrderDomainEntity from '../../domain/entity/order.domain-entity';
import { OrderModel } from '../../infrastructure/database/mongo/model/order.model';

export default class OrderMapper {
  // public static toDatabase(domain: OrderDomainEntity): OrderModel {
  //   const order = new OrderModel();
  //   order.id = domain.id;
  //   const paymentInfo = new PaymentInfo();
  //   order.status = domain.status;
  //   order.deliveryInfo = null;
  //   return order;
  // }
  // public static toDomain(
  //   order: OrderModel,
  //   products: { product: ProductDomainEntity; count: number }[]
  // ): OrderDomainEntity {
  //   return new OrderDomainEntity(order.id, products, '2');
  // }
}
