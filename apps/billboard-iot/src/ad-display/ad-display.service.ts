import { Injectable } from '@nestjs/common';
import { ContractService } from './contract.service';

@Injectable()
export class AdDisplayService {
    constructor(private readonly contractService: ContractService) {
        contractService.registerForAdPurchased(this);
    }

    async newAdHandler(adId: number) {
        const adInfo = await this.contractService.getAdInfo(adId);
        console.log(`GOT AN AD TO DISPLAY, will now display ad #${adId}`);
    }
}
