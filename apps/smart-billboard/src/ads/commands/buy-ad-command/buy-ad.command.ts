export class BuyAdCommand {
    constructor(
      public readonly image: string,
      public readonly durationSeconds: number,
    ) {}
  }