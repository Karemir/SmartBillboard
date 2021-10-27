import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BillboardContractService } from "../../billboard-contract.service";
import { Billboard } from "../../entities/billboard.entity";
import { ListBillboardsQuery } from "./list-billboards.query";
import { ListBillboardQueryResultItem, ListBillboardsQueryResult } from "./list-billboards.query-result";

@QueryHandler(ListBillboardsQuery)
export class ListBillboardsQueryHandler implements IQueryHandler<ListBillboardsQuery> {
    constructor(
        private readonly billboardContractService: BillboardContractService,
        @InjectRepository(Billboard)
        private readonly billboardRepository: Repository<Billboard>,
    ) { }

    async execute(query: ListBillboardsQuery): Promise<ListBillboardsQueryResult> {
        const allBoards = await this.billboardRepository.find();

        let mapPromises = allBoards.map(this.BillboardToQueryResult, this);
        const items = await Promise.all(mapPromises);

        return new ListBillboardsQueryResult(items);
    }

    private async BillboardToQueryResult(billboard: Billboard): Promise<ListBillboardQueryResultItem> {
        let balance = await this.billboardContractService.getBalance(billboard.address);
        let isRegistered: boolean;

        try {
            isRegistered = await this.billboardContractService.isBillboardRegistered(billboard.address);
        } catch (error) {
            console.log(`Billboard address is incorrect: ${error}`)
            isRegistered = false;
        }

        let item = new ListBillboardQueryResultItem(
            billboard.address,
            billboard.location,
            billboard.description,
            billboard.type,
            balance,
            isRegistered,
        )
        return item;
    }
}