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
import SnapshotAbstractRepository from '../repository/snapshot.abstract-repository';
import { SNAPSHOT_PER_EVENTS_NUMBER } from '../snapshot.const';

export default class EventSnapshotInterceptor implements NestInterceptor {
  private logger = new Logger('Kafka');
  constructor(private readonly productQueryService: ProductQueryService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const rpcContext = context.switchToRpc();
    const kafkaContext = rpcContext.getContext<KafkaContext>();
    const topic = kafkaContext.getTopic();

    Logger.log(topic);
    if (
      topic === EventTopics.productCreated ||
      topic === EventTopics.productUpdated ||
      topic === EventTopics.productDeleted ||
      topic === EventTopics.menuCreated ||
      topic === EventTopics.menuUpdated
    ) {
      await this.productQueryService.makeSnapshot();
    }

    // Queue for snapshotting use BULL
    return next.handle();
  }
}
