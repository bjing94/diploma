import { Types } from 'mongoose';

export class ProductDomainEntity {
  private _id: string;

  private _name: string;

  private _active: boolean;

  private _imgLink?: string;

  constructor(name: string, id?: string, imgLink?: string) {
    this.id = id ?? new Types.ObjectId(id).toString();
    this.name = name;
    this.imgLink = imgLink;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get active(): boolean {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  public get imgLink(): string {
    return this._imgLink;
  }
  public set imgLink(value: string) {
    this._imgLink = value;
  }
}
