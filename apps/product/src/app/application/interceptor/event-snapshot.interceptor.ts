import {
  ProductCreatedEventPayload,
  ProductDeletedEventPayload,
  ProductUpdatedEventPayload,
} from '@burger-shop/contracts';
import { EventStoreProductService, ISaveEvent } from '@burger-shop/event-store';
import { EventTopics } from '@burger-shop/kafka-module';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import ProductQueryService from '../product.query.service';
import ProductAbstractRepository from '../repository/product.abstract-repository';
import SnapshotAbstractRepository from '../repository/snapshot.abstract-repository';

export default class EventSnapshotInterceptor implements NestInterceptor {
  private logger = new Logger('Kafka');
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductAbstractRepository,
    @Inject('SnapshotRepository')
    private readonly snapshotRepository: SnapshotAbstractRepository,
    private readonly eventStoreProductService: EventStoreProductService,
    private readonly productQueryService: ProductQueryService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const rpcContext = context.switchToRpc();
    const kafkaContext = rpcContext.getContext<KafkaContext>();
    const message = kafkaContext.getMessage();
    const topic = kafkaContext.getTopic();

    if (
      topic === EventTopics.productCreated ||
      topic === EventTopics.productUpdated ||
      topic === EventTopics.productDeleted ||
      topic === EventTopics.menuCreated ||
      topic === EventTopics.menuUpdated
    ) {
      await this.makeSnapshot();
    }

    // Queue for snapshotting use BULL
    return next.handle();
  }

  private async makeSnapshot() {
    const currentEventsCount =
      await this.eventStoreProductService.getEventsCount();
    const latestSnapshot = await this.snapshotRepository.getLatest();
    const minDate = latestSnapshot ? latestSnapshot.updatedAt : null;
    const latestEventCount = latestSnapshot.eventsCount;
    if (currentEventsCount - latestEventCount < 5) {
      return;
    }
    Logger.log(`Creating snapshot`);
    Logger.log(`Latest snapshot was ${minDate}`);
    const events = await this.eventStoreProductService.getProductEvents(
      minDate
    );
    for (const event of events) {
      await this.applyEventToSnapshot(event);
    }
    Logger.log(`Snapshot created at ${new Date()}`);
    const eventsCount = await this.eventStoreProductService.getEventsCount();
    await this.snapshotRepository.create(eventsCount);
  }

  private async applyEventToSnapshot(event: ISaveEvent) {
    if (event.name === EventTopics.productCreated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductCreatedEventPayload;
      await this.productQueryService.onCreated({ product });
    }
    if (event.name === EventTopics.productUpdated) {
      const { product } = JSON.parse(
        event.payload
      ) as ProductUpdatedEventPayload;
      await this.productQueryService.onUpdated({ product });
    }
    if (event.name === EventTopics.productDeleted) {
      const { id } = JSON.parse(event.payload) as ProductDeletedEventPayload;
      await this.productQueryService.onDeleted({ id });
    }
  }
}
