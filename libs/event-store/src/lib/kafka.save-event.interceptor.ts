import { EventStoreService } from '@burger-shop/event-store';
import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';

@Injectable()
export class KafkaSaveEventInterceptor implements NestInterceptor {
  private logger = new Logger(KafkaSaveEventInterceptor.name);

  constructor(private readonly eventStoreService: EventStoreService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToRpc();
    const data = request.getContext<KafkaContext>();
    const message = data.getMessage();
    const topic = data.getTopic();
    if (this.isEvent(topic)) {
      this.logger.log(`${topic}: ${JSON.stringify(message.value)}`);
      await this.eventStoreService.saveEvent({
        name: topic,
        payload: JSON.stringify(message.value),
      });
    }
    return next.handle();
  }

  private isEvent(topic: string) {
    const [, , type] = topic.split('.');
    return type === 'event';
  }
}
