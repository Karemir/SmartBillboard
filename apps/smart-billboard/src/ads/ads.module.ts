import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdsController } from './ads.controller';
import { BuyAdCommandHandler } from './commands/buy-ad-command/buy-ad.handler';
import { ContractService } from './contract.service';
import { GetAdStatusQueryHandler } from './queries/get-ad-status-query/get-ad-status.handler';
export const CommandHandlers = [BuyAdCommandHandler];
export const QueryHandlers = [GetAdStatusQueryHandler] 

@Module({
  controllers: [AdsController],
  providers: [
    ContractService,
    ...CommandHandlers,
    ...QueryHandlers
  ],
  imports: [ConfigModule.forRoot({
    envFilePath: '.env'
  }),
  CqrsModule]
})
export class AdsModule { }
