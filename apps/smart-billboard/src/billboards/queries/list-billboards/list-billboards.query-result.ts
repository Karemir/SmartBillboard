export class ListBillboardsQueryResult {
    constructor(
        public billboards: ListBillboardQueryResultItem[],
    ) { }
}

export class ListBillboardQueryResultItem {
    constructor(
        public address: string,
        public location: string,
        public description: string,
        public type: string,
        public walletBallance: number,
        public isRegisteredInContract: boolean,
    ) { }
}