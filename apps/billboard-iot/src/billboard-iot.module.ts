import { Module } from '@nestjs/common';
import { BillboardIotController } from './billboard-iot.controller';
import { BillboardIotService } from './billboard-iot.service';

@Module({
  imports: [],
  controllers: [BillboardIotController],
  providers: [BillboardIotService],
})
export class BillboardIotModule {}
