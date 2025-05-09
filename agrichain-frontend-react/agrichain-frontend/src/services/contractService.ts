import { ethers} from "ethers";
import { abi } from "../../../../agrichain-smartcontract/artifacts/contracts/Agrichain.sol/Agrichain.json"

let provider: ethers.BrowserProvider;
let signer;
let contract: ethers.Contract;

export const initializeContract = async () => {
    if (!window.ethereum) {
        console.error('MetaMask not Connected');
        throw new Error('Please insure you have MetaMask installed.');
    } else {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, signer);
    }

    return { provider, signer, contract };
};

initializeContract();
