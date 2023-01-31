import { DeliveryStatus } from '@burger-shop/interfaces';

export default class DeliveryInfoDomainEntity {
  constructor(part?: Partial<DeliveryInfoDomainEntity>) {
    part = part ?? {};
    Object.assign(this, part);
  }

  public readonly tableId: string;
  public readonly status: DeliveryStatus;
}
