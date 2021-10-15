import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigService } from 'aws-sdk';
import { AdDisplayService } from './ad-display.service';
import { ContractService } from './contract.service';
import { DisplayDeviceService } from './display-device/display-device.service';

@Module({
  providers: [
    AdDisplayService,
    ContractService,
    DisplayDeviceService,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    HttpModule,
    EventEmitterModule,
  ]
})
export class AdDisplayModule { }
