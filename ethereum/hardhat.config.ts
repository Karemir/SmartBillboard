import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import '@nomiclabs/hardhat-web3';
import '@typechain/hardhat'
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("transfer", "Transfers eth from first account to given wallet")
  .addParam("toAccount", "Receiving account")
  .addParam("amount", "Amount to transfer")
  .setAction(async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const firstAcc = accounts[0];
    const firstAccAddress = await firstAcc.getAddress();
    const firstAccValue = await firstAcc.getBalance();
    const toAcc = taskArgs.toAccount;
    const toAccValue = await hre.ethers.provider.getBalance(toAcc);
    const amount = taskArgs.amount;
    const amountInWei = hre.ethers.utils.parseEther(amount);

    console.log(`Transfering ${amount} eth from ${firstAccAddress}(${hre.ethers.utils.formatEther(firstAccValue)}) to ${toAcc}(${toAccValue})`);

    await firstAcc.sendTransaction({
      to: toAcc,
      value: amountInWei
    });

    const toAccValueAfter = await hre.ethers.provider.getBalance(toAcc);
    console.log(`After transfer, ${toAcc} has ${hre.ethers.utils.formatUnits(toAccValueAfter, "ether")} ethers`);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: {
        mnemonic: process.env.RINKEBY_MNEMONIC,
      }
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
