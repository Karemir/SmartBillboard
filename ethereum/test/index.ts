import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AdsBoard", function () {
  let contract: Contract;
  let ownerSigner: SignerWithAddress;
  let billboard1Signer: SignerWithAddress;
  let billboard2Signer: SignerWithAddress;

  before(async () => {
    const AdsBoard = await ethers.getContractFactory('AdsBoard');
    contract = await AdsBoard.deploy();
    await contract.deployed();

    const signers = await ethers.getSigners();
    ownerSigner = signers[0];
    billboard1Signer = signers[1];
    billboard2Signer = signers[2];
  });

  it('Should emit AdPurchased after buyAd', async () => {
    const testPath = "abc";
    const testDuration = 42;

    await expect(contract.buyAd(testPath, testDuration))
          .to.emit(contract, 'AdPurchased')
          .withArgs(ownerSigner.address, testPath, testDuration);
  });

  it('Should allow to register new address as billboard', async () => {
    await contract.connect(billboard1Signer).registerAsBillboard();
  });

  it('Should fail to register billboard for second time', async () => {
    try {
      await contract.connect(billboard1Signer).registerAsBillboard();
    } catch (err: any) {
      expect(err.toString()).to.contain('Already registered billboard');
    }
  });

  it('Should emit AdDisplayed after billboardDisplayed', async () => {
    const testPath = "abc";

    await expect(contract.connect(billboard1Signer).billboardDisplayed(ownerSigner.address, testPath))
          .to.emit(contract, 'AdDisplayed')
          .withArgs(ownerSigner.address, testPath, billboard1Signer.address);
  });
});
