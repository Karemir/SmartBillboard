import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { ContractService } from './contract.service';

@Module({
  controllers: [AdsController],
  providers: [ContractService, AdsService],
  imports: [ConfigModule.forRoot({
    envFilePath: '.env'
  })]
})
export class AdsModule { }
