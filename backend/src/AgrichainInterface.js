require('dotenv').config();
const { ethers } = require("ethers");
const abi = require("./contracts/Agrichain.json").abi;

const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.ADMIN_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
const signer = new ethers.Wallet(privateKey, provider);
const Agrichain = new ethers.Contract(contractAddress, abi, signer);

async function callContractFunction(functionName, ...args) {
    try {
        if (!Agrichain[functionName] || typeof Agrichain[functionName] !== 'function') {
            throw new Error(`Error calling Agrichain function: ${functionName} does not exist`);
        }
        const tx = await Agrichain[functionName](...args);
        return await tx.wait();
    } catch (err) {
        return null;
    }
}

module.exports = {
    callContractFunction,
    getContract: () => Agrichain
};