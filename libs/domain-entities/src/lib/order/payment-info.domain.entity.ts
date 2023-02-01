import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
import { generateOrderId } from './helper/generate-order-id';

export default class PaymentInfoDomainEntity {
  constructor(part?: Partial<PaymentInfoDomainEntity>) {
    part = part ?? {};
    this.id = part.id ?? generateOrderId();
    Object.assign(this, part);
  }

  public id: string;
  public externalId?: string;
  public status: PaymentStatus;
  public total: number;
  public type: PaymentType;
}
