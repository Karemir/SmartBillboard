//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// TODO:
// - owner could set price per minut, and buyAd could be open to anyone.
// - create some sort of time management
// - allow user to buy ads targeted to specific billboard, and queue ads one after another
// - display ad at specific time.
contract AdsBoard {
    address private owner;
    string private basePath;
    uint32 public adCount;

    struct Ad {
        address author;
        uint32 duration;
        bytes32 imageHash;
        string path;
        bool isDisplayed;
    }

    mapping (address => bool) public registeredBillboards;
    mapping (uint32 => Ad) public ads;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyBillboard() {
        require(registeredBillboards[msg.sender] == true, "Not registered billboard");
        _;
    }

    event AdPurchased(uint32 id);
    event AdDisplayed(uint32 id, address billboardAddress);

    constructor(string memory _basePath) {
        owner = msg.sender;
        basePath = _basePath;
        adCount = 0;
    }

    function buyAd(bytes32 imageHash, uint32 duration) external onlyOwner returns (uint32 id) {
        adCount = adCount + 1;

        Ad memory ad = Ad({
            author: msg.sender,
            duration: duration,
            imageHash: imageHash,
            path: basePath,
            isDisplayed: false
        });
        ads[adCount] = ad;

        emit AdPurchased(adCount);

        return adCount;
    }

    function registerAsBillboard() external {
        require(registeredBillboards[msg.sender] == false, "Already registered billboard");

        registeredBillboards[msg.sender] = true;
    }

    function billboardDisplayed(uint32 adId) external onlyBillboard {
        ads[adId].isDisplayed = true;
        emit AdDisplayed(adId, msg.sender);
    }

    function getAd(uint32 adId) external view returns (
        uint32 id,
        address author,
        uint32 duration,
        bytes32 imageHash,
        string memory path,
        bool isDisplayed)
        {

        Ad memory ad = ads[adId];
        return (adId, ad.author, ad.duration, ad.imageHash, ad.path, ad.isDisplayed);
    }
}
