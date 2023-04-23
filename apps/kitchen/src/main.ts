import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/application/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_HOST],
        clientId: 'kitchen-client',
      },
      consumer: {
        groupId: 'kitchen-consumer',
      },
    },
  });
  await app.listen();
  Logger.log(`🚀 Kitchen microservice started!`);
}

bootstrap();
