export type UserRole = 'farmer' | 'processor' | 'distributor' | 'retailer' | 'certifier' | 'admin' | 'regulator';
export type ProductStatus = 'planted' | 'growing' | 'harvested' | 'processed'| 'packaged'| 'shipped'| 'delivered'| 'received'| 'sold'
export type CertificateStatus = 'valid' | 'expired' | 'revoked';

export interface User {
    username: string;
    name: string;
    email: string;
    role: UserRole;
    organization?: string;
    phone?: string;
    address?: string;
    verified?: boolean;
}

export interface Certificate {
    id: string;
    name: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
    status: CertificateStatus;
    documentUrl?: string;
}

export interface Location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
}

export interface SupplyChainStep {
    id: string;
    productId: string;
    timestamp: string;
    action: string;
    description: string;
    performedBy: {
        id: string;
        name: string;
        role: UserRole;
        organization: string;
    };
    location: Location;
    temperature?: number;
    humidity?: number;
    metadata?: Record<string, any>;
    certificates?: Certificate[];
    verified: boolean;
    transactionHash: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    type: string;
    imageUrl?: string;
    batchId: string;
    qrCode: string;
    qrImage: string;
    createdAt: string;
    currentLocation: Location;
    certificates: Certificate[];
    supplyChain: SupplyChainStep[];
    status: ProductStatus;
    farmer: {
        username: string;
        name: string;
        organization: string;
    };
    retailPrice?: number;
    verificationCount: number;
    lastVerified?: string;
}