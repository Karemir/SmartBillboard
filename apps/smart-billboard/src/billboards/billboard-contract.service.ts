import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { ethers } from 'ethers';
import { AdsBoard__factory } from '../../../../ethereum/typechain/factories/AdsBoard__factory';
import ethereumConfig from './configs/ethereum.config';

@Injectable()
export class BillboardContractService {
    private readonly ethProvider: ethers.providers.JsonRpcProvider;
    private readonly signer: ethers.Signer;
    private readonly contract: ethers.Contract;

    constructor(
        @Inject(ethereumConfig.KEY)
        private readonly ethereumConfiguration: ConfigType<typeof ethereumConfig>
    ) {

        console.log('Initializing BillboardContractService');
        this.ethProvider = new ethers.providers.JsonRpcProvider(ethereumConfiguration.url);
        if (ethereumConfiguration.useLocal) {
            console.log('BillboardContractService using local config');
            this.signer = this.ethProvider.getSigner();
        } else {
            console.log('BillboardContractService using public config');
            const wallet = ethers.Wallet.fromMnemonic(ethereumConfiguration.walletMnemonic);
            this.signer = wallet.connect(this.ethProvider);
        }

        const factory = new AdsBoard__factory(this.signer);
        this.contract = new ethers.Contract(ethereumConfiguration.adsboardContract,
            factory.interface,
            this.signer);
    }

    async isBillboardRegistered(billboardAddress: string): Promise<boolean> {
        const result = await this.contract.registeredBillboards(billboardAddress);
        return result;
    }

    async getBalance(walletAddress: string): Promise<number> {
        const balance = await this.ethProvider.getBalance(walletAddress);
        return +ethers.utils.formatEther(balance);
    }
}
