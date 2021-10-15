import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse } from '@nestjs/swagger';
import { BuyAdCommand } from './commands/buy-ad-command/buy-ad.command';
import { BuyAdCommandResult } from './commands/buy-ad-command/buy-ad.command-result';
import { AdStatusDto } from './dto/ad-status.dto';
import { buyAdResultDto } from './dto/buy-ad-result.dto';
import { BuyAdDto } from './dto/buy-ad.dto';
import { GetAdStatusQuery } from './queries/get-ad-status-query/get-ad-status.query';
import { GetAdStatusQueryResult } from './queries/get-ad-status-query/get-ad-status.query-result';

@Controller('ads')
export class AdsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus : QueryBus,
    ) { }

    @Post('/buyAd')
    @ApiResponse({ status: 201, type: buyAdResultDto, description: 'returns buyAdResultDto TODO' })
    async buyAd(@Body() buyAdDto: BuyAdDto) : Promise<buyAdResultDto> {
        const result: BuyAdCommandResult = await this.commandBus.execute(new BuyAdCommand(buyAdDto.image, buyAdDto.durationSeconds));
        return { id: result.id, etherscanUrl: result.etherscanUrl }
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: AdStatusDto, description: 'returns AdStatusDto TODO' })
    async adStatus(@Param('id', ParseIntPipe) id: number) :Promise<AdStatusDto> {
        const result: GetAdStatusQueryResult = await this.queryBus.execute(new GetAdStatusQuery(id))
        return {id:result.id, author: result.author, duration: result.duration, path: result.path, isDisplayed: result.isDisplayed};
    }
}
