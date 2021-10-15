import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ContractService } from "../../contract.service";
import { GetAdStatusQuery } from "./get-ad-status.query";
import { GetAdStatusQueryResult } from "./get-ad-status.query-result";

@QueryHandler(GetAdStatusQuery)
export class GetAdStatusQueryHandler implements IQueryHandler<GetAdStatusQuery> {
  constructor(
    private readonly contractService: ContractService,
  ) {}

  async execute(query: GetAdStatusQuery) : Promise<GetAdStatusQueryResult> {
    const result = await this.contractService.getAdStatus(query.id);
    return new GetAdStatusQueryResult(result.id, result.author, result.duration, result.path, result.isDisplayed)
  }
}