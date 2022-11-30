import DeliveryInfoDomainEntity from './delivery-info.domain-entiy';
import OrderItemDomainEntity from './order-item.domain-entity';
import { OrderStatus } from './order.status.enum';
import PaymentInfoDomainEntity from './payment-info.domain.entity';

export default class OrderDomainEntity {
  constructor(obj?: Partial<OrderDomainEntity>) {
    obj = obj ?? {};
    if (!obj.id) {
      // Generate here id
      obj.id = '14870';
    }
    Object.assign(this, obj);
  }

  id: string;

  status: OrderStatus;

  orderItems: OrderItemDomainEntity[];

  paymentInfo: PaymentInfoDomainEntity;

  deliveryInfo: DeliveryInfoDomainEntity;

  createdAt: Date;
}
