export class ListBillboardsQueryResult {
    constructor(items: ListBillboardQueryResultItem) { }
}

export class ListBillboardQueryResultItem {
    constructor(
        address: string,
        location: string,
        description: string,
        type: string,
        walletBallance: number,
    ) { }
}