import { DeliveryStatus } from '@burger-shop/interfaces';

export default class DeliveryInfoDomainEntity {
  public readonly tableId: string;
  public readonly status: DeliveryStatus;
}
