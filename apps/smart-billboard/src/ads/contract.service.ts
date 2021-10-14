/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { AdsBoard__factory } from '../../../../ethereum/typechain/factories/AdsBoard__factory';
import { AdStatusDto } from './dto/ad-status.dto';

/*
        snippet to catch events:
        contract.on('AdPurchased', (author, path, duration) => {
            console.log(`Ad purchased! ${author} ${path} ${duration}`);
        });

        snipper to get all events:

        const eventsFilter = contract.filters.AdPurchased();
        const events = await contract.queryFilter(eventsFilter);
        console.log(events);

        return events.map(evt => {
            return { sender: evt.args.author, path: evt.args.path, duration: evt.args.duration.toNumber() };
        })

 */

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

    async buyAd(imageHash: string, adDurationSeconds: number): Promise<number> {
        console.log(`BuyAd on blockchain is complete, resulting id: ${imageHash} (imageHash)`);
        const possibleNewId = await this.contract.callStatic.buyAd(imageHash, adDurationSeconds)
        await this.contract.buyAd(imageHash, adDurationSeconds);

        console.log(`BuyAd on blockchain is complete, resulting id: ${possibleNewId} (PROBABLY)`);
        return Number(possibleNewId);
    }

    async getAdStatus(id: number): Promise<AdStatusDto> {
        const ad = await this.contract.getAd(id);
        const resultId: number = Number(ad.id);

        if (resultId == 0) {
            throw new NotFoundException();
        }

        return {
            id: resultId,
            author: ad.author,
            duration: Number(ad.duration),
            path: ad.path + ad.imageHash,
            isDisplayed: ad.isDisplayed
        };
    }
}
