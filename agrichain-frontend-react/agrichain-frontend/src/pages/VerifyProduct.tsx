import React, { useState } from 'react';
import { QrCode, Search } from 'lucide-react';
import QRScanner from '../components/verification/QRScanner';
import VerificationResult from '../components/verification/VerificationResult';
import { Product } from '../types';
import {DashboardLayout} from "../components/layout/DashboardLayout.tsx";

// (DEMO) Mock product data
const mockProduct: Product = {
    id: '1',
    name: 'Organic Coffee Beans',
    description: 'Premium Arabica coffee beans grown using sustainable farming practices',
    type: 'Coffee',
    imageUrl: 'https://images.pexels.com/photos/4919737/pexels-photo-4919737.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    batchId: 'BATCH-CF-2023-001',
    qrCode: 'QR-001',
    createdAt: '2023-10-15T08:30:00Z',
    currentLocation: {
        id: 'loc1',
        name: 'Distributor Warehouse',
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Distribution Way, New York, NY'
    },
    certificates: [
        {
            id: 'cert1',
            name: 'Organic Certified',
            issuedBy: 'Organic Farmers Association',
            issuedDate: '2023-09-12T10:00:00Z',
            expiryDate: '2024-09-12T10:00:00Z',
            status: 'valid'
        }
    ],
    supplyChain: [],
    status: 'shipped',
    farmer: {
        username: 'farm1',
        name: 'Highland Coffee Co-op',
        organization: 'Highland Farmers Association'
    },
    retailPrice: 12.99,
    verificationCount: 367,
    lastVerified: '2023-11-20T14:22:10Z'
};

// TODO: Dynamic verify page and not use dashboard layout to allow anyone not connected to view it
const VerifyProduct: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [verifiedProduct, setVerifiedProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleScan = () => {
        setIsScanning(false);
        setLoading(true);

        // Simulate API call to verify product
        setTimeout(() => {
            setLoading(false);

            // For demo purposes, always use the mock product data
            setVerifiedProduct(mockProduct);

            // (DEMO) Update verification count
            mockProduct.verificationCount += 1;
            mockProduct.lastVerified = new Date().toISOString();
        }, 1500);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchInput.trim()) {
            setError('Please enter a product ID or batch number');
            return;
        }

        setLoading(true);
        setError(undefined);

        // Simulate API call to verify product
        setTimeout(() => {
            setLoading(false);

            // For demo purposes, only accept a specific ID
            if (searchInput === 'BATCH-CF-2023-001' || searchInput === '1') {
                setVerifiedProduct(mockProduct);

                // (DEMO) Update verification count
                mockProduct.verificationCount += 1;
                mockProduct.lastVerified = new Date().toISOString();
            } else {
                setError('No product found with this ID. Please check and try again.');
                setVerifiedProduct(null);
            }
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-3xl font-semibold mb-2">Verify Product Authenticity</h1>
                        <p className="text-neutral-600 max-w-xl mx-auto">
                            Scan a product QR code or enter a product ID to verify its authenticity and view its journey through the supply chain.
                        </p>
                    </header>

                    {!verifiedProduct && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div
                                className="card card-hover text-center py-10 cursor-pointer"
                                onClick={() => setIsScanning(true)}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="h-16 w-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                                        <QrCode className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
                                    <p className="text-neutral-600 max-w-xs mx-auto">
                                        Use your camera to scan the product QR code for instant verification
                                    </p>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Enter Product ID</h3>
                                <p className="text-neutral-600 mb-6 text-center md:text-left">
                                    Enter the product ID or batch number found on the product packaging
                                </p>

                                <form onSubmit={handleSearch}>
                                    <div className="relative mb-4">
                                        <input
                                            type="text"
                                            placeholder="e.g., BATCH-CF-2023-001"
                                            className="input pl-10"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full">
                                        Verify Product
                                    </button>
                                </form>

                                {error && (
                                    <div className="mt-4 text-error text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(verifiedProduct || loading) && (
                        <VerificationResult
                            product={verifiedProduct}
                            loading={loading}
                            error={error}
                        />
                    )}

                    <div className="mt-10 bg-neutral-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Why Verify?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        <path d="m9 12 2 2 4-4" />
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">Ensure Authenticity</h4>
                                <p className="text-sm text-neutral-600">
                                    Confirm your product is genuine and not counterfeit by verifying its blockchain record.
                                </p>
                            </div>

                            <div>
                                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">Track Journey</h4>
                                <p className="text-sm text-neutral-600">
                                    See the complete journey of your product from farm to shelf, including all handling and processing steps.
                                </p>
                            </div>

                            <div>
                                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-primary"
                                    >
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">View Certifications</h4>
                                <p className="text-sm text-neutral-600">
                                    Check all certifications and compliance records to ensure your product meets quality and safety standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isScanning && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setIsScanning(false)}
                />
            )}
        </DashboardLayout>
    );
};

export default VerifyProduct;