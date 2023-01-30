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
export default class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger('Kafka');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const kafkaContext = rpcContext.getContext<KafkaContext>().getMessage();
    this.logger.verbose(
      `Topic: ${JSON.stringify(
        kafkaContext['topic']
      )}, Payload: ${JSON.stringify(kafkaContext.value)}`
    );
    return next.handle();
  }
}
