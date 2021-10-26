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

        const items = allBoards.map((billboard) => {
            return new ListBillboardQueryResultItem(
                billboard.address,
                billboard.location,
                billboard.description,
                billboard.type,
                42.3,
            );
        });
        return new ListBillboardsQueryResult(items);
    }
}