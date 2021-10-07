import { Injectable } from '@nestjs/common';

@Injectable()
export class BillboardIotService {
  getHello(): string {
    return 'Hello World! IOT SERVICE';
  }
}
