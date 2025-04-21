// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Auth {
    mapping(address => string) public walletToRole;

    function registerWallet(string memory _role) public {
        require(bytes(walletToRole[msg.sender]).length == 0, "Already registered");
        walletToRole[msg.sender] = _role;
    }

    function verifyWallet(address _wallet) public view returns (string memory) {
        return walletToRole[_wallet];
    }
}