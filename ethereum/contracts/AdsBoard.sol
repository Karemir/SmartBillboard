//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// TODO:
// - owner could set price per minut, and buyAd could be open to anyone.
// - create some sort of time management
// - allow user to buy ads targeted to specific billboard, and queue ads one after another
// - display ad at specific time.
contract AdsBoard {
    using SafeMath for uint256;

    address private owner;
    mapping (address => bool) registeredBillboards;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyBillboard() {
        require(registeredBillboards[msg.sender] == true, "Not registered billboard");
        _;
    }

    event AdPurchased(address author, string path, uint256 duration);
    event AdDisplayed(address author, string path, address billboardAddress);

    constructor() {
        owner = msg.sender;
    }

    function buyAd(string calldata path, uint256 duration) external onlyOwner {
        emit AdPurchased(msg.sender, path, duration);
    }

    function registerAsBillboard() external {
        require(registeredBillboards[msg.sender] == false, "Already registered billboard");

        registeredBillboards[msg.sender] = true;
    }

    function billboardDisplayed(address author, string calldata path) external onlyBillboard {
        emit AdDisplayed(author, path, msg.sender);
    }
}
