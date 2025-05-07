// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agrichain {

    // Admin is permanent owner
    address public immutable admin;

    // Type
    enum ProductStatus { planted, growing, harvested, processed, packaged, shipped, delivered, received, sold }

    // Structures
    struct Certificate {
        string id;
        address issuedBy;
        uint issuedDate;
        uint expiryDate;
    }

    struct SupplyChainStep {
        string id;
        uint256 timestamp;
        ProductStatus action;
        string description;
        address performedBy;
        string location;
        int256 temperature;
        int256 humidity;
        bool verified;
    }

    struct Product {
        string id;
        string name;
        string description;
        string productType;
        string imageUrl;
        string batchId;
        string qrCode;
        uint256 createdAt;
        string currentLocation;
        ProductStatus status;
        address currentOwner;
        uint256 verificationCount;
        uint256 lastVerified;
        address[] ownershipHistory;
    }

    // Mappings
    mapping(string => Product) public products;
    mapping(string => Certificate) public certificates;
    mapping(string => SupplyChainStep) public supplyChainSteps;
    mapping(string => string[]) public productCertificates; // productId => certIds[]
    mapping(string => string[]) public productSupplyChain;  // productId => stepIds[]
    mapping(string => mapping(string => string[])) public stepCertificates; // productId => stepId => certIds[]

    // Arrays
    string[] public productIds;
    string[] public certificateIds;

    // Events
    event ProductRegistered(string indexed id, string name, address owner);
    event ProductStatusChanged(string indexed id, ProductStatus newStatus);
    event SupplyChainStepAdded(string indexed productId, string stepId, ProductStatus action);
    event OwnershipTransferred(string indexed productId, address from, address to);
    event CertificateRequested(string indexed productId, string indexed stepId, address requester, string certType);
    event CertificateIssued(string indexed certId, string indexed productId, string indexed stepId, address issuedBy, string metadata);

    constructor() {
        admin = msg.sender;
    }

    modifier productExists(string memory productId) {
        require(bytes(products[productId].id).length != 0, "Product does not exist");
        _;
    }

    // Product function
    function registerProduct(
        string memory id,
        string memory name,
        string memory description,
        string memory productType,
        string memory imageUrl,
        string memory batchId,
        string memory qrCode,
        string memory initialLocation
    ) external {
        require(bytes(products[id].id).length == 0, "Product ID exists");

        address[] memory ownershipHistory = new address[](1);
        ownershipHistory[0] = msg.sender;

        Product memory newProduct = Product({
            id: id,
            name: name,
            description: description,
            productType: productType,
            imageUrl: imageUrl,
            batchId: batchId,
            qrCode: qrCode,
            createdAt: block.timestamp,
            currentLocation: initialLocation,
            status: ProductStatus.planted,
            currentOwner: msg.sender,
            verificationCount: 0,
            lastVerified: 0,
            ownershipHistory: ownershipHistory
        });

        products[id] = newProduct;
        productIds.push(id);

        emit ProductRegistered(id, name, msg.sender);
    }

    // Supply Chain function
    function addSupplyChainStep(
        string memory productId,
        string memory stepId,
        ProductStatus action,
        string memory description,
        string memory location,
        int256 temperature,
        int256 humidity
    ) external productExists(productId) {
        require(msg.sender == products[productId].currentOwner, "Only owner can add steps");
        require(bytes(supplyChainSteps[stepId].id).length == 0, "Step ID exists");

        SupplyChainStep memory newStep = SupplyChainStep({
            id: stepId,
            timestamp: block.timestamp,
            action: action,
            description: description,
            performedBy: msg.sender,
            location: location,
            temperature: temperature,
            humidity: humidity,
            verified: false
        });

        supplyChainSteps[stepId] = newStep;
        productSupplyChain[productId].push(stepId);

        products[productId].status = action;
        products[productId].currentLocation = location;

        emit SupplyChainStepAdded(productId, stepId, action);
        emit ProductStatusChanged(productId, action);
    }

    // Certificate functions
    function requestCertificate(
        string memory productId,
        string memory stepId,
        string memory certType
    ) external productExists(productId) {
        emit CertificateRequested(productId, stepId, msg.sender, certType);
    }

    function issueCertificate(
        string memory certId,
        string memory productId,
        string memory stepId,
        uint256 expiryDate,
        string memory metadata
    ) external productExists(productId) {
        require(bytes(certificates[certId].id).length == 0, "Certificate exists");

        certificates[certId] = Certificate({
            id: certId,
            issuedBy: msg.sender,
            issuedDate: block.timestamp,
            expiryDate: expiryDate
        });

        productCertificates[productId].push(certId);
        if(bytes(stepId).length > 0) {
            stepCertificates[productId][stepId].push(certId);
        }
        certificateIds.push(certId);

        emit CertificateIssued(certId, productId, stepId, msg.sender, metadata);
    }

    // Transfer ownership function
    function transferOwnership(
        string memory productId,
        address newOwner
    ) external productExists(productId) {
        require(msg.sender == products[productId].currentOwner, "Only owner can transfer");

        address previousOwner = products[productId].currentOwner;
        products[productId].currentOwner = newOwner;
        products[productId].ownershipHistory.push(newOwner);

        emit OwnershipTransferred(productId, previousOwner, newOwner);
    }

    function verifyProduct(string memory productId) external productExists(productId) {
        products[productId].verificationCount++;
        products[productId].lastVerified = block.timestamp;

        for (uint i = 0; i < productSupplyChain[productId].length; i++) {
            string memory stepId = productSupplyChain[productId][i];
            supplyChainSteps[stepId].verified = true;
        }
    }

    // Getters
    function getProductSupplyChain(string memory productId)
    external view productExists(productId)
    returns (string[] memory)
    {
        return productSupplyChain[productId];
    }

    function getProductCertificates(string memory productId)
    external view productExists(productId)
    returns (string[] memory)
    {
        return productCertificates[productId];
    }

    function getStepCertificates(string memory productId, string memory stepId)
    external view productExists(productId)
    returns (string[] memory)
    {
        return stepCertificates[productId][stepId];
    }

    function getOwnershipHistory(string memory productId)
    external view productExists(productId)
    returns (address[] memory)
    {
        return products[productId].ownershipHistory;
    }

    function getProductCount() public view returns (uint) {
        return productIds.length;
    }
}