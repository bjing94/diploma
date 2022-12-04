import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
export default class PaymentInfoDomainEntity {
  constructor(part?: Partial<PaymentInfoDomainEntity>) {
    part = part ?? {};
    Object.assign(this, part);
  }

  public status: PaymentStatus;
  public total: number;
  public type: PaymentType;
}
