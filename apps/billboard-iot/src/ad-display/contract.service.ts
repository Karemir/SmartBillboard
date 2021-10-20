import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import ethereumConfig from './configs/ethereum.config';
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
    private signerAddress: string;

    constructor(
        @Inject(ethereumConfig.KEY)
        private readonly ethereumConfiguration: ConfigType<typeof ethereumConfig>,
        private readonly eventEmitter: EventEmitter2,
    ) {

        console.log('Initializing ContractService');
        this.ethProvider = new ethers.providers.JsonRpcProvider(ethereumConfiguration.url);
        if (ethereumConfiguration.useLocal) {
            console.log('ContractService using local config');
            this.signer = this.ethProvider.getSigner();
        } else {
            console.log('ContractService using public config');
            const wallet = ethers.Wallet.fromMnemonic(ethereumConfiguration.walletMnemonic);
            this.signer = wallet.connect(this.ethProvider);
        }

        const factory = new AdsBoard__factory(this.signer);
        this.contract = new ethers.Contract(ethereumConfiguration.adsboardContract,
            factory.interface,
            this.signer);

        console.log(`-- using adboard contract address: ${this.contract.address}`);

        this.signer.getAddress().then((addr) => {
            console.log(`-- using account: ${addr}`);
            this.signerAddress = addr;
            this.registerAsBillboardIfNeeded();
            this.listenToAdPurchasedEvents();
        }, (err) => {
            console.log(`RPC CONNECTION FAILED, ${err}`);
        })
    }

    private listenToAdPurchasedEvents() {
        console.log(`-- registering for AdPurchased events`);
        this.contract.on('AdPurchased', async (id) => {
            const idNumber: number = id;
            console.log(`Ad purchased! ${idNumber}`);

            this.eventEmitter.emit(NewAdEventName, new NewAdEvent(idNumber))
        });
    }

    private registerAsBillboardIfNeeded() {
        this.isRegisteredAsBillboard().then((isBillboard) => {
            console.log(`ContractService: is billboard - ${isBillboard}`);
            if (!isBillboard) {
                this.registerAsBillboard();
            }
        });
    }

    async getAdInfo(id: number): Promise<AdInfoDto> {
        const ad = await this.contract.getAd(id);
        const resultId: number = ad.id;

        if (resultId == 0) {
            throw new NotFoundException();
        }

        return {
            id: resultId,
            author: ad.author,
            duration: ad.duration,
            path: ad.path + ad.imageHash,
            isDisplayed: ad.isDisplayed
        };
    }

    async isRegisteredAsBillboard(): Promise<boolean> {
        const result = await this.contract.registeredBillboards(this.signerAddress);
        return result;
    }

    async registerAsBillboard(): Promise<boolean> {
        try {
            await this.contract.registerAsBillboard();
            console.log("ContractService: Billboard registered");
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