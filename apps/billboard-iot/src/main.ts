import { NestFactory } from '@nestjs/core';
import { BillboardIotModule } from './billboard-iot.module';

async function bootstrap() {
  const app = await NestFactory.create(BillboardIotModule);
  await app.listen(3000);
}
bootstrap();
