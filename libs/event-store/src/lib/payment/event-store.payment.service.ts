import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CONNECTION_NAME,
  ResourceNames,
  SNAPSHOT_FREQUENCY,
} from '../event-store.const';
import { EventDocument } from '../event.model';
import { ISaveEvent } from '@burger-shop/interfaces';
import { Logger } from '@nestjs/common/services';
import PaymentDomainTransformer from './payment.domain-transformer';

@Injectable()
export class EventStorePaymentService {
  constructor(
    @InjectModel(ResourceNames.PAYMENT, CONNECTION_NAME)
    private readonly paymentModel: Model<EventDocument>,

    @InjectModel(ResourceNames.PAYMENT + '_snapshot', CONNECTION_NAME)
    private readonly paymentSnapshotModel: Model<EventDocument>
  ) {}

  public async savePaymentEvent(dto: ISaveEvent) {
    return this.paymentModel.create(dto);
  }

  public async getPaymentEvents(filter: {
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
    return this.paymentModel.find(mongoFilter).sort({ createdAt: 'asc' });
  }

  public async getPaymentEventStream(id: string) {
    return this.paymentModel.find({ objectId: id }).sort({ createdAt: 'asc' });
  }

  public async getEventsCount() {
    const count = await this.paymentModel.count();
    return count;
  }

  public async getPaymentSnapshots(from?: Date, to?: Date) {
    const filter: any = {};
    if (from) {
      filter['updatedAt'] = {};
      filter['updatedAt']['$gte'] = from;
    }
    if (to) {
      filter['updatedAt'] = filter['updatedAt'] ?? {};
      filter['updatedAt']['$lt'] = to;
    }
    return this.paymentSnapshotModel.find(filter);
  }

  public async makeSnapshotPaymens() {
    // Здесь сохраняем снэпшоты
    // В products_snapshot
    const latestSnapshot = await this.paymentSnapshotModel
      .findOne()
      .sort({ createdAt: 'desc' });

    const date =
      latestSnapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const snapshots = await this.getPaymentSnapshots(date);
    const events = await this.getPaymentEvents({ from: date });
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
      const product = PaymentDomainTransformer.hydrate(data);
      const event = PaymentDomainTransformer.snapshot(product);
      await this.paymentSnapshotModel.findOneAndUpdate(
        { objectId: event.objectId },
        event,
        {
          upsert: true,
        }
      );
    }
    Logger.log('Snapshotted payments');
  }

  public async getPayment(id: string) {
    const snapshot = await this.paymentSnapshotModel.findOne({ objectId: id });
    const date = snapshot?.createdAt ?? new Date(Date.parse('2023-02-24'));
    const events = await this.getPaymentEvents({ from: date, id });
    if (snapshot) {
      events.push(snapshot);
    }
    return PaymentDomainTransformer.hydrate(events);
  }
}
