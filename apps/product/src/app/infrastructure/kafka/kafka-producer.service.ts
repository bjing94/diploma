import {
  ProductCreated,
  ProductDeleted,
  ProductUpdated,
} from '@burger-shop/contracts';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class KafkaProducerService {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  public async emitProductCreated(
    payload: ProductCreated.Payload
  ): Promise<void> {
    await this.kafka.emit<void, ProductCreated.Payload>(
      ProductCreated.topic,
      payload
    );
  }

  public async emitProductUpdated(
    payload: ProductUpdated.Payload
  ): Promise<void> {
    await this.kafka.emit<void, ProductUpdated.Payload>(
      ProductUpdated.topic,
      payload
    );
  }

  public async emitProductDeleted(
    payload: ProductDeleted.Payload
  ): Promise<void> {
    await this.kafka.emit<void, ProductDeleted.Payload>(
      ProductDeleted.topic,
      payload
    );
  }
}
