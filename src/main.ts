import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  

  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Tp Rest API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
    }),
  );
  app.useGlobalFilters();
  
  app.enableVersioning({
    type: VersioningType.URI, 
  });

  
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
