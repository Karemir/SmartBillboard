import { registerAs } from "@nestjs/config";

export default registerAs('ethereum', () => ({
    useLocal: +process.env.ETHERS_USE_LOCAL,
    url: +process.env.ETHERS_USE_LOCAL ? process.env.ETHEREUM_URL_LOCAL : process.env.ETHEREUM_URL,
    adsboardContract: +process.env.ETHERS_USE_LOCAL ? process.env.ADSBOARD_CONTRACT_LOCAL : process.env.ADSBOARD_CONTRACT,
    walletMnemonic: process.env.ETHEREUM_WALLET_MNEMONIC,
}));