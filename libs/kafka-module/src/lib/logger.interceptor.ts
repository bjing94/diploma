import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaLoggerInterceptor implements NestInterceptor {
  private logger = new Logger('Kafka');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const kafkaContext = rpcContext.getContext<KafkaContext>();
    const message = kafkaContext.getMessage();

    this.logger.verbose(
      `Topic: ${JSON.stringify(
        kafkaContext.getTopic()
      )}, Payload: ${JSON.stringify(message.value)}`
    );
    return next.handle();
  }
}
