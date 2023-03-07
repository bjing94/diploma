import {
  ProductCreatedEventPayload,
  ProductUpdatedEventPayload,
  ProductDeletedEventPayload,
} from '@burger-shop/contracts';
import { ISaveEvent } from '@burger-shop/interfaces';
import { EventTopics } from '@burger-shop/kafka-module';
import { Types } from 'mongoose';

export class ProductDomainEntity {
  private _id: string;

  private _name: string;

  private _price: number;

  private _active: boolean;

  constructor(name: string, price: number, id?: string) {
    this.id = id ?? new Types.ObjectId(id).toString();
    this.name = name;
    this.price = price;
  }

  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    this._id = value;
  }

  public get price(): number {
    return this._price;
  }
  public set price(value: number) {
    this._price = value;
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

  public static hydrate(events: ISaveEvent[]) {
    const product = new ProductDomainEntity('', 0, '');
    events.forEach((event) => {
      product.applyEvent(event);
    });
    return product;
  }

  public applyEvents(events: ISaveEvent[]) {
    events.forEach((event) => {
      this.applyEvent(event);
    });
  }

  private applyEvent(event: ISaveEvent) {
    if (event.name === 'snapshot') {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      this.id = product.id;
      this.name = product.name;
      this.price = product.price;
      this.active = true;
    }
    if (event.name === EventTopics.productCreated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductCreatedEventPayload;
      this.id = product.id;
      this.name = product.name;
      this.price = product.price;
      this.active = true;
    }
    if (event.name === EventTopics.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      this.name = product.name;
      this.price = product.price;
    }
    if (event.name === EventTopics.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      this.name = product.name;
      this.price = product.price;
    }
    if (event.name === EventTopics.productDeleted) {
      const { id } = JSON.parse(event.payload) as ProductDeletedEventPayload;
      this.active = false;
    }
  }
}
