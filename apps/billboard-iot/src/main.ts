import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BillboardIotModule } from './billboard-iot.module';

async function bootstrap() {
  const app = await NestFactory.create(BillboardIotModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
  }));

  await app.listen(3001);
}
bootstrap();
