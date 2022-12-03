import { PaymentStatus, PaymentType } from '@burger-shop/interfaces';
export default class PaymentInfoDomainEntity {
  public status: PaymentStatus;
  public total: number;
  public type: PaymentType;
}
