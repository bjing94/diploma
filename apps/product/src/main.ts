/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { KafkaLoggerInterceptor } from '@burger-shop/kafka-module';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:29092'],
        clientId: 'product-client',
      },
      consumer: {
        groupId: 'product-consumer',
        retry: {
          retries: 0,
        },
      },
    },
  });
  app.useGlobalInterceptors(new KafkaLoggerInterceptor());
  await app.listen();
  Logger.log(`Products microservice started.`);
}

bootstrap();
