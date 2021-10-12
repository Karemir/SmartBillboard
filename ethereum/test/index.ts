import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AdsBoard", function () {
  let contract: Contract;
  let ownerSigner: SignerWithAddress;
  let billboard1Signer: SignerWithAddress;
  let billboard2Signer: SignerWithAddress;

  let basePath: string = 'testPath/';

  before(async () => {
    const AdsBoard = await ethers.getContractFactory('AdsBoard');
    contract = await AdsBoard.deploy(basePath);
    await contract.deployed();

    const signers = await ethers.getSigners();
    ownerSigner = signers[0];
    billboard1Signer = signers[1];
    billboard2Signer = signers[2];
  });

  it('Should emit AdPurchased after buyAd', async () => {
    const testDuration = 42;
    const imageHash = 'abc';

    await expect(contract.buyAd(imageHash, testDuration))
          .to.emit(contract, 'AdPurchased')
      .withArgs(1);
  });

  it('Should return Ad with correct values', async () => {
    const testDuration = 42;

    let ad = await contract.getAd(1);

    expect(ad.id.toNumber()).to.equal(1);
    expect(ad.author).to.equal(await ownerSigner.getAddress());
    expect(ad.duration).to.equal(testDuration);
    expect(ad.path).to.equal(`testPath/abc`);
    expect(ad.isDisplayed).to.equal(false);
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
    const adId = 1;

    await expect(contract.connect(billboard1Signer).billboardDisplayed(1))
      .to.emit(contract, 'AdDisplayed')
      .withArgs(1, billboard1Signer.address);

    let ad = await contract.getAd(1);
    expect(ad.isDisplayed).to.equal(true);
  });
});
