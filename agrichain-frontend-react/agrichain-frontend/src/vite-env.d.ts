/// <reference types="vite/client" />
interface Window {
    ethereum?: import('@metamask/providers').MetaMaskInpageProvider;
}

interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESS: string;
    readonly VITE_BLOCKCHAIN_PROVIDER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}