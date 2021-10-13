import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AdsBoard__factory } from '../../../../ethereum/typechain/factories/AdsBoard__factory';
import { AdDisplayService } from './ad-display.service';
import { AdInfoDto } from './dto/ad-info.dto';

@Injectable()
export class ContractService {
    private readonly ethProvider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    private readonly contract: ethers.Contract;

    constructor(private readonly configService: ConfigService) {
        const rpcUrl = configService.get<string>('ETHEREUM_URL');
        const adBoardContractAddress = configService.get<string>('ADSBOARD_CONTRACT'); // 0x5FbDB2315678afecb367f032d93F642f64180aa3

        this.ethProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.signer = this.ethProvider.getSigner();

        const factory = new AdsBoard__factory(this.signer);
        this.contract = new ethers.Contract(adBoardContractAddress,
            factory.interface,
            this.signer);

        console.log('Initializing ContractService');
        console.log(`-- using adboard contract address: ${this.contract.address}`);

        this.signer.getAddress().then((addr) => {
            console.log(`-- using account: ${addr}`);
        }, (err) => {
            console.log(`RPC CONNECTION FAILED, ${err}`);
        })
    }

    registerForAdPurchased(adDisplayService: AdDisplayService) {
        this.contract.on('AdPurchased', async (id) => {
            const idNumber: number = id.toNumber();
            console.log(`Ad purchased! ${idNumber}`);

            adDisplayService.newAdHandler(idNumber).catch((reason) => {
                console.log(`registered callback on new ad failed, ${reason}`);
            });
        });
    }

    async getAdInfo(id: number): Promise<AdInfoDto> {
        const ad = await this.contract.getAd(id);
        const resultId: number = ad.id.toNumber();

        if (resultId == 0) {
            throw new NotFoundException();
        }

        return {
            id: resultId,
            author: ad.author,
            duration: ad.duration.toNumber(),
            path: ad.path,
            isDisplayed: ad.isDisplayed
        };

    }
}