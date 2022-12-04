export default class ProductDomainEntity {
  constructor(part?: Partial<ProductDomainEntity>) {
    part = part ?? {};
    Object.assign(this, part);
  }
  public price: number;
  public name: string;
  public id: string;
}
