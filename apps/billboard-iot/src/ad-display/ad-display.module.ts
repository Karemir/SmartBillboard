import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdDisplayService } from './ad-display.service';
import { ContractService } from './contract.service';

@Module({
  providers: [AdDisplayService, ContractService],
  imports: [ConfigModule.forRoot({
    envFilePath: '.env'
  })]
})
export class AdDisplayModule { }
