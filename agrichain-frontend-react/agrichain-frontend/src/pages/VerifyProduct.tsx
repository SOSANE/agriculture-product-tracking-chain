import React, {useState} from 'react';
import {QrCode, Search} from 'lucide-react';
import QRScanner from '../components/verification/QRScanner';
import VerificationResult from '../components/verification/VerificationResult';
import {Product} from '../types';
import Footer from "../components/layout/Footer.tsx";
import {getProductById} from "../services/productService.ts";

const VerifyProduct: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [verifiedProduct, setVerifiedProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleScan = async (qrData: string) => {
        setIsScanning(false);
        setLoading(true);

        try {
            if (qrData) {
                const data = qrData.split('|');
                const contractAddress = data[0];

                if (contractAddress === import.meta.env.VITE_CONTRACT_ADDRESS) {
                    setLoading(false);

                    const response = await getProductById(qrData[1]);
                    if (!response) {
                        console.error('Failed to fetch product');
                        throw Error('Failed to fetch product');
                    }

                    if (!response?.id) {
                        setError('No product found with this ID. Please check and try again.');
                        setVerifiedProduct(null);
                        throw new Error('Failed to fetch product');
                    }

                    const verify = await fetch(`api/verify-product/${response.id}`);
                    if (!verify) {
                        setError('Could not verify product.');
                        setVerifiedProduct(null);
                        throw new Error('Failed to verify product.');
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchInput.trim()) {
            setError('Please enter a product ID or batch number');
            return;
        }

        setLoading(true);
        setError(undefined);

        try {
            setLoading(false);
            const response = await getProductById(searchInput);

            if (!response?.id) {
                setError('No product found with this ID. Please check and try again.');
                setVerifiedProduct(null);
                throw new Error('Failed to fetch product');
            }

            const verify = await fetch(`api/verify-product/${response.id}`);
            if (!verify) {
                setError('Could not verify product.');
                setVerifiedProduct(null);
                throw new Error('Failed to verify product.');
            }
            setVerifiedProduct(response);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-3xl font-semibold mb-2">Verify Product Authenticity</h1>
                        <p className="text-neutral-600 max-w-xl mx-auto">
                            Scan a product QR code or enter a product ID to verify its authenticity and view its journey
                            through the supply chain.
                        </p>
                    </header>

                    {!verifiedProduct && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div
                                className="card card-hover text-center py-10 cursor-pointer"
                                onClick={() => setIsScanning(true)}
                            >
                                <div className="flex flex-col items-center">
                                    <div
                                        className="h-16 w-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                                        <QrCode className="h-8 w-8 text-primary"/>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
                                    <p className="text-neutral-600 max-w-xs mx-auto">
                                        Use your camera to scan the product QR code for instant verification
                                    </p>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Enter Product
                                    ID</h3>
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
                                        <Search
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400"/>
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
                                <div
                                    className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
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
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                                        <path d="m9 12 2 2 4-4"/>
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">Ensure Authenticity</h4>
                                <p className="text-sm text-neutral-600">
                                    Confirm your product is genuine and not counterfeit by verifying its blockchain
                                    record.
                                </p>
                            </div>

                            <div>
                                <div
                                    className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
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
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">Track Journey</h4>
                                <p className="text-sm text-neutral-600">
                                    See the complete journey of your product from farm to shelf, including all handling
                                    and
                                    processing steps.
                                </p>
                            </div>

                            <div>
                                <div
                                    className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
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
                                        <path
                                            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </div>
                                <h4 className="font-medium mb-2">View Certifications</h4>
                                <p className="text-sm text-neutral-600">
                                    Check all certifications and compliance records to ensure your product meets quality
                                    and
                                    safety standards.
                                </p>
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
            </div>
            <Footer/>
        </div>

    );
};

export default VerifyProduct;