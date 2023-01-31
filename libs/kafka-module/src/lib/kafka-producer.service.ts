import {
  ProductCreated,
  ProductDeleted,
  ProductUpdated,
} from '@burger-shop/contracts';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class KafkaProducerService {
  private logger = new Logger(KafkaProducerService.name);

  constructor(@Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  public async emit<TResult, TInput>(topic: string, value: TInput) {
    this.logger.verbose(`Emit ${topic}, value:${JSON.stringify(value)}`);

    const producer = await this.kafka.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }

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
