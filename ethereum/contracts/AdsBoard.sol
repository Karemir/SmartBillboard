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
    uint256 public adCount;

    struct Ad {
        uint256 id;
        address author;
        uint256 duration;
        string path;
        bool isDisplayed;
    }

    mapping (address => bool) public registeredBillboards;
    mapping (uint256 => Ad) public ads;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyBillboard() {
        require(registeredBillboards[msg.sender] == true, "Not registered billboard");
        _;
    }

    event AdPurchased(uint256 id);
    event AdDisplayed(uint256 id, address billboardAddress);

    constructor(string memory _basePath) {
        owner = msg.sender;
        basePath = _basePath;
        adCount = 0;
    }

    function buyAd(string calldata imageHash, uint256 duration) external onlyOwner returns (uint256 id) {
        adCount = adCount + 1;

        string memory path = string(abi.encodePacked(basePath, imageHash));
        Ad memory ad = Ad({
            id: adCount,
            author: msg.sender,
            duration: duration,
            path: path,
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

    function billboardDisplayed(uint256 adId) external onlyBillboard {
        ads[adId].isDisplayed = true;
        emit AdDisplayed(adId, msg.sender);
    }

    function getAd(uint256 adId) external view returns (
        uint256 id,
        address author,
        uint256 duration,
        string memory path,
        bool isDisplayed)
        {

        Ad memory ad = ads[adId];
        return (ad.id, ad.author, ad.duration, ad.path, ad.isDisplayed);
    }
}
