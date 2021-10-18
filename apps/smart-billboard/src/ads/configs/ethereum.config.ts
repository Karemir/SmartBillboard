import { registerAs } from "@nestjs/config";

export default registerAs('ethereum', () =>({
    url: process.env.ETHEREUM_URL,
    adsboardContract: process.env.ADSBOARD_CONTRACT
}));