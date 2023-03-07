import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CONNECTION_NAME,
  ResourceNames,
  SNAPSHOT_FREQUENCY,
} from './event-store.const';
import { EventDocument } from './event.model';
import { ProductDomainEntity } from '@burger-shop/domain-entity';
import { ISaveEvent } from '@burger-shop/interfaces';
import {
  ProductUpdatedEventPayload,
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
} from '@burger-shop/contracts';
import { EventTopics } from '@burger-shop/kafka-module';
import ProductDomainTransformer from './product.domain-transformer';
import { Logger } from '@nestjs/common/services';

@Injectable()
export class EventStoreProductService {
  constructor(
    @InjectModel(ResourceNames.MENU, CONNECTION_NAME)
    private readonly menuModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT, CONNECTION_NAME)
    private readonly productModel: Model<EventDocument>,
    @InjectModel(ResourceNames.PRODUCT + '_snapshot', CONNECTION_NAME)
    private readonly productSnapshotModel: Model<EventDocument>,
    @InjectModel(ResourceNames.MENU + '_snapshot', CONNECTION_NAME)
    private readonly menuSnapshotModel: Model<EventDocument>
  ) {}

  public async saveMenuEvent(dto: ISaveEvent) {
    return this.menuModel.create(dto);
  }

  public async saveProductEvent(dto: ISaveEvent) {
    await this.makeSnapshotProducts();
    return this.productModel.create(dto);
  }

  public async getMenuEvents(filter: { from?: Date; to?: Date; id?: string }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.menuModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getProductEvents(filter: {
    from?: Date;
    to?: Date;
    id?: string;
  }) {
    const { from, to, id } = filter;
    const mongoFilter: any = {};
    if (from) {
      mongoFilter['updatedAt'] = {};
      mongoFilter['updatedAt']['$gte'] = from;
    }
    if (to) {
      mongoFilter['updatedAt'] = mongoFilter['updatedAt'] ?? {};
      mongoFilter['updatedAt']['$lt'] = to;
    }
    if (id) {
      mongoFilter['objectId'] = id;
    }
    return this.productModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getProductEventStream(id: string, from?: Date, to?: Date) {
    const filter: any = { id: id };
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.productModel.find(filter).sort({ createdAt: 'asc' });
  }

  public async getMenuEventStream(id: string) {
    return this.menuModel.find({ objectId: id }).sort({ createdAt: 'asc' });
  }

  public async getEventsCount() {
    const productEvents = await this.productModel.count();
    const menuEvents = await this.menuModel.count();
    return productEvents + menuEvents;
  }

  public async getProductSnapshots(from?: Date, to?: Date) {
    const filter: any = {};
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.productSnapshotModel.find(filter);
  }

  // TODO:
  // Separate snapshots from domain
  // Check save
  public async makeSnapshotProducts() {
    // Здесь сохраняем снэпшоты
    // В products_snapshot
    const latestSnapshot = await this.productSnapshotModel
      .findOne()
      .sort({ createdAt: 'desc' });

    const date =
      latestSnapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const snapshots = await this.getProductSnapshots(date);
    const events = await this.getProductEvents({ from: date });
    if (events.length < SNAPSHOT_FREQUENCY) return;

    const eventStreamMap = new Map<string, EventDocument[]>();
    snapshots.forEach((event) => {
      const events = eventStreamMap.get(event.objectId);
      if (events) {
        events.push(event);
        eventStreamMap.set(event.objectId, events);
      } else {
        eventStreamMap.set(event.objectId, [event]);
      }
    });
    events.forEach((event) => {
      const events = eventStreamMap.get(event.objectId);
      if (events) {
        events.push(event);
        eventStreamMap.set(event.objectId, events);
      } else {
        eventStreamMap.set(event.objectId, [event]);
      }
    });

    for (const [productId, data] of eventStreamMap.entries()) {
      const product = ProductDomainTransformer.hydrate(data);
      const event = ProductDomainTransformer.snapshot(product);
      await this.productSnapshotModel.findOneAndUpdate(
        { objectId: event.objectId },
        event,
        {
          upsert: true,
        }
      );
    }
    Logger.log('Snapshotted products');
  }

  public async getProduct(id: string) {
    const snapshot = await this.productSnapshotModel.findOne({ objectId: id });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getProductEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    return ProductDomainTransformer.hydrate(events);
  }

  public async getMenu(id: string) {
    const snapshot = await this.menuSnapshotModel.findOne({ objectId: id });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getMenuEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    return ProductDomainTransformer.hydrate(events);
  }
}
