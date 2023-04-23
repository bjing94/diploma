/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ExceptionFilter, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/application/app.module';
import { MyExceptionFilter } from './app/application/exception.filter';
import { KafkaExceptionFilter } from './app/application/filters/kafka.exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_HOST],
        clientId: 'order-client',
      },
      consumer: {
        groupId: 'order-consumer',
      },
    },
  });
  app.useGlobalFilters(new MyExceptionFilter());
  await app.listen();
  Logger.log(`Orders microservice started.`);
}

bootstrap();
