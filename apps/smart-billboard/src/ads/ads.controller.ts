import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { AdStatusDto } from './dto/ad-status.dto';
import { buyAdResultDto } from './dto/buy-ad-result.dto';
import { BuyAdDto } from './dto/buy-ad.dto';

@Controller('ads')
export class AdsController {
    constructor(
        private readonly adsService: AdsService,
    ) { }

    @Post('/buyAd')
    @ApiResponse({ status: 201, type: buyAdResultDto, description: 'returns buyAdResultDto TODO' })
    async buyAd(@Body() buyAdDto: BuyAdDto) : Promise<buyAdResultDto> {
        return await this.adsService.buyAd(buyAdDto);
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: AdStatusDto, description: 'returns AdStatusDto TODO' })
    async adStatus(@Param('id', ParseIntPipe) id: number) :Promise<AdStatusDto> {
        return await this.adsService.getAdStatus(id);
    }
}
