import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddBillboardResult } from './commands/add-billboard/add-billboard-result';
import { AddBillboardCommand } from './commands/add-billboard/add-billboard.command';
import { AddBillboardDto } from './dto/add-billboard.dto';
import { ListBillboardsQuery } from './queries/list-billboards/list-billboards.query';

@ApiTags('billboards')
@Controller('billboards')
export class BillboardsController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) { }

    @Post()
    @ApiResponse({ status: 201, description: "Notifies service backend, that a new billboard exists and fills extended information about it" })
    async addBillboard(@Body() billboardDto: AddBillboardDto) {
        const command = new AddBillboardCommand(
            billboardDto.address,
            billboardDto.location,
            billboardDto.description,
            billboardDto.type,
        );

        const result: AddBillboardResult = await this.commandBus.execute(command);

        if (!result.result) {
            throw new BadRequestException(`Billboard could not be added, ${result.message}`);
        }
    }

    @Get()
    async listBillboards() {
        const result = await this.queryBus.execute(new ListBillboardsQuery());
        return result;
    }
}
