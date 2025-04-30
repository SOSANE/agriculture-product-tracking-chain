export type UserRole = 'farmer' | 'processor' | 'distributor' | 'retailer' | 'consumer' | 'certifier' | 'admin' | 'regulator';

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
    organization: string;
    verified: boolean;
}

export interface Certificate {
    id: string;
    name: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string;
    status: 'valid' | 'expired' | 'revoked';
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
    createdAt: string;
    currentLocation: Location;
    certificates: Certificate[];
    supplyChain: SupplyChainStep[];
    status: 'cultivating' | 'harvested' | 'processing' | 'packaged' | 'shipping' | 'delivered' | 'sold';
    farmer: {
        id: string;
        name: string;
        organization: string;
    };
    retailPrice?: number;
    verificationCount: number;
    lastVerified?: string;
}

export interface DashboardMetric {
    id: string;
    title: string;
    value: number;
    change: number;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: 'info' | 'warning' | 'error' | 'success';
    link?: string;
}