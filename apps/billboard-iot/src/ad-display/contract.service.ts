import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { ethers } from 'ethers';
import { EventEmitter2 } from 'eventemitter2';
import { AdsBoard__factory } from '../../../../ethereum/typechain/factories/AdsBoard__factory';
import { AdInfoDto } from './dto/ad-info.dto';
import { AdDisplayedEvent, AdDisplayedEventName } from './event/ad-displayed.event';
import { NewAdEvent, NewAdEventName } from './event/new-ad.event';

@Injectable()
export class ContractService {
    private readonly ethProvider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    private readonly contract: ethers.Contract;

    constructor(
        private readonly configService: ConfigService,
        private readonly eventEmitter: EventEmitter2,
    ) {
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

        this.listenToAdPurchasedEvents();
    }

    private listenToAdPurchasedEvents() {
        console.log(`-- registering for AdPurchased events`);
        this.contract.on('AdPurchased', async (id) => {
            const idNumber: number = id.toNumber();
            console.log(`Ad purchased! ${idNumber}`);

            this.eventEmitter.emit(NewAdEventName, new NewAdEvent(idNumber))
        });
    }

    private registerAsBillboardIfNeeded() {

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

    async isRegisteredAsBillboard(): Promise<boolean> {

    }

    async registerAsBillboard(): Promise<boolean> {
        try {
            await this.contract.registerAsBillboard();
            return true;
        } catch (err) {
            console.log("Billboard registration failed");
            console.log(err);
            return false;
        }
    }

    @OnEvent(AdDisplayedEventName) // Called by DisplayDevice
    async onAdDisplaySuccess(adDisplayed: AdDisplayedEvent) {
        console.log(`ContractService: handle ad displayed for ${JSON.stringify(adDisplayed)}...`);
        await this.contract.billboardDisplayed(adDisplayed.id);
        console.log("DONE");
    }
}