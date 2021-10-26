export class AddBillboardCommand {
    constructor(
        readonly address: string,
        readonly location: string,
        readonly description: string,
        readonly type: string,
    ) { }
}