import { ethers} from "ethers";
import { abi } from "../../../../agrichain-smartcontract/artifacts/contracts/Agrichain.sol/Agrichain.json"
import {ProductStatus} from "../types";

let provider: ethers.JsonRpcProvider;
let signer;
let contract: ethers.Contract;

export const initializeContract = async () => {
    if (!window.ethereum) {
        console.error('MetaMask not Connected');
        throw new Error('Please insure you have MetaMask installed.');
    } else {
        provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
        signer = await provider.getSigner();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
    }

    return { provider, signer, contract };
};

initializeContract();

// Register product function
export const registerProduct = async (
    id: string,
    name: string,
    description: string,
    productType: string,
    imageUrl: string,
    batchId: string,
    qrCode: string,
    initialLocation: string
)=> {
    const tx = await contract.registerProduct(id, name, description, productType, imageUrl, batchId, qrCode, initialLocation);
    await tx.wait();
    return tx;
};

// Add a step to the supply chain function
export const addSupplyChainStep = async (
    productId: string,
    id: string,
    action: ProductStatus,
    description: string,
    location: string,
    temperature: string,
    humidity: string
)=> {
    const tx = await contract.addSupplyChainStep(productId, id, action, description, location, temperature, humidity);
    await tx.wait();
    return tx;
}

// Request a certificate function
export const requestCertificate = async (
    productId: string,
    stepId: string
)=> {
    const tx = await contract.requestCertificate(productId, stepId);
    await tx.wait();
    return tx;
}