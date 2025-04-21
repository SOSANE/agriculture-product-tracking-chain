// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgriProduct {
    struct Product {
        string id;
        string name;
        string farm;
        uint256 harvestDate;
        address currentOwner;
        string[] certifications;
        string[] supplyChainEvents;
    }

    mapping(string => Product) public products;
    string[] public productIds;

    event ProductRegistered(string id, string name, string farm);
    event ProductVerified(string id, address verifier);

    function registerProduct(
        string memory _id,
        string memory _name,
        string memory _farm,
        uint256 _harvestDate
    ) public {
        require(bytes(products[_id].id).length == 0, "Product already exists");

        products[_id] = Product({
            id: _id,
            name: _name,
            farm: _farm,
            harvestDate: _harvestDate,
            currentOwner: msg.sender,
            certifications: new string[](0),
            supplyChainEvents: new string[](0)
        });

        productIds.push(_id);
        emit ProductRegistered(_id, _name, _farm);
    }

    function verifyProduct(string memory _id) public {
        require(bytes(products[_id].id).length != 0, "Product does not exist");
        emit ProductVerified(_id, msg.sender);
    }

    function getProductCount() public view returns (uint) {
        return productIds.length;
    }
}