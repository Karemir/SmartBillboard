import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
  }));

  const swaggerOpts = new DocumentBuilder()
    .setTitle('Smart Billboard')
    .setDescription('Backend API for users who want to display ads on a billboard')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOpts);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
