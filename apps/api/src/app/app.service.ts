import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientProxy
  ) {}

  async getData() {
    await this.kafkaClient.emit('test', 'my message');
    return { message: 'Welcome to api!' };
  }
}
