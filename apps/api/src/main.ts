import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Swagger for api gateway')
    .setDescription('Burger shop API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/swagger`, app, document);

  const port = process.env.PORT || 3333;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
  Logger.log(`🚀 Api is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(
    `🚀 Api swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`
  );
}

bootstrap();
