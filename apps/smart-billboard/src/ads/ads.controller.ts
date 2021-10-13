import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AdsService } from './ads.service';
import { BuyAdDto } from './dto/buy-ad.dto';

@Controller('ads')
export class AdsController {
    constructor(
        private readonly adsService: AdsService,
    ) { }

    @Post('/buyAd')
    buyAd(@Body() buyAdDto: BuyAdDto) {
        return this.adsService.buyAd(buyAdDto);
    }

    @Get(':id')
    adStatus(@Param('id', ParseIntPipe) id: number) {
        return this.adsService.getAdStatus(id);
    }
}
