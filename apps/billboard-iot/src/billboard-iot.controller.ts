import { Controller, Get } from '@nestjs/common';
import { BillboardIotService } from './billboard-iot.service';

@Controller()
export class BillboardIotController {
  constructor(private readonly billboardIotService: BillboardIotService) {}

  @Get()
  getHello(): string {
    return this.billboardIotService.getHello();
  }
}
