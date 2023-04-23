/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { getMongoConnectionStringEventStore } from './app/modules/events/event.const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Swagger for api gateway')
    .setDescription('Burger shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document);

  const port = process.env.PORT || 3334;
  await app.listen(port);
  Logger.log(
    `🚀 Admin api is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `🚀 Admin api swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`
  );
}

console.log(getMongoConnectionStringEventStore());
console.log(
  process.env.READ_DB_HOST,
  process.env.EVENT_DB_HOST,
  process.env.KAFKA_HOST
);
bootstrap();
