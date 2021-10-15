export class GetAdStatusQueryResult {
    constructor(
        public readonly id: number,
        public readonly author: string,
        public readonly duration: number,
        public readonly path: string,
        public readonly isDisplayed:boolean
    ) { }
}