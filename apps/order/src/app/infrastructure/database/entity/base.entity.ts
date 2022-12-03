import { PrimaryColumn } from 'typeorm';

export default class BaseEntity<T extends { _id: string }> {
  constructor(part?: Partial<T>) {
    Object.assign(this, part);
  }

  @PrimaryColumn('uuid')
  public _id: string;
}
