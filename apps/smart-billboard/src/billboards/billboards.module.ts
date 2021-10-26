import { Inject, Module } from '@nestjs/common';
import { BillboardsController } from './billboards.controller';
import { BillboardsService } from './billboards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from './configs/db.config';
import { BillboardContractService } from './billboard-contract.service';
import { AddBillboardCommandHandler } from './commands/add-billboard/add-billboard.handler';
import ethereumConfig from './configs/ethereum.config';
import { Billboard } from './entities/billboard.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ListBillboardsQueryHandler } from './queries/list-billboards/list-billboards.handler';
export const CommandHandlers = [AddBillboardCommandHandler];
export const QueryHandlers = [ListBillboardsQueryHandler];

@Module({
  controllers: [BillboardsController],
  providers: [
    BillboardsService,
    BillboardContractService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ConfigModule.forFeature(dbConfig),
    ConfigModule.forFeature(ethereumConfig),
    TypeOrmModule.forFeature([Billboard]),
    CqrsModule,
  ],
})
export class BillboardsModule { }
