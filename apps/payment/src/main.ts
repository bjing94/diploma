/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { PaymentModule } from './app/application/payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(
    PaymentModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_HOST],
          clientId: 'payment-client',
        },
        consumer: {
          groupId: 'payment-consumer',
        },
      },
    }
  );
  await app.listen();
  Logger.log(`Payment microservice started`);
}

bootstrap();
