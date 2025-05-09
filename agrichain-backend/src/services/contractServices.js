const { ethers } = require("ethers");
const { abi } = require("../../../agrichain-smartcontract/artifacts/contracts/Agrichain.sol/Agrichain.json");

let provider;
let signer;
let contract;

const initializeContract = async () => {
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
    signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        abi,
        signer
    );

    return { provider, signer, contract };
};

initializeContract();

// Register product function
const registerProduct = async (id, name, description, productType, imageUrl, batchId, qrCode, initialLocation) => {
    const tx = await contract.registerProduct(id, name, description, productType, imageUrl, batchId, qrCode, initialLocation);
    await tx.wait();
    return tx;
};


// Add a step to the supply chain function
const addSupplyChainStep = async (productId, id, action, description, location, temperature, humidity) => {
    const tx = await contract.addSupplyChainStep(productId, id, action, description, location, temperature, humidity);
    await tx.wait();
    return tx;
};

// Request a certificate function
const requestCertificate = async (productId, stepId) => {
    const tx = await contract.requestCertificate(productId, stepId);
    await tx.wait();
    return tx;
};

module.exports = {
    initializeContract,
    registerProduct,
    addSupplyChainStep,
    requestCertificate
};