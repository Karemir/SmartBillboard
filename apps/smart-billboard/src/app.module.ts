import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdsModule } from './ads/ads.module';
import { ConfigModule } from '@nestjs/config';
import { BillboardsModule } from './billboards/billboards.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AdsModule,
    ConfigModule.forRoot(),
    BillboardsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true,
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
