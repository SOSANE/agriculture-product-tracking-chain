import React, { useState } from 'react';
import { CheckCircle, Info, Download, Share2, ArrowLeft, MapPin, Calendar, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import SupplyChainTimeline from '../components/product/SupplyChainTimeline';
import { Product } from '../types';
import {DashboardLayout} from "../components/layout/DashboardLayout.tsx";

// Mock data
const mockProduct: Product = {
    id: '1',
    name: 'Organic Coffee Beans',
    description: 'Premium Arabica coffee beans grown using sustainable farming practices in the highlands. These beans are cultivated without the use of synthetic pesticides or fertilizers, ensuring a pure and natural taste. The rich volcanic soil and ideal climate conditions contribute to the exceptional quality of these coffee beans.',
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
        },
        {
            id: 'cert2',
            name: 'Fair Trade',
            issuedBy: 'Fair Trade International',
            issuedDate: '2023-08-15T10:00:00Z',
            expiryDate: '2024-08-15T10:00:00Z',
            status: 'valid'
        }
    ],
    supplyChain: [
        {
            id: 'step1',
            productId: '1',
            timestamp: '2023-06-01T09:00:00Z',
            action: 'planted',
            description: 'Coffee seedlings planted in highland area at optimal season',
            performedBy: {
                id: 'user1',
                name: 'Juan Valdez',
                role: 'farmer',
                organization: 'Highland Coffee Co-op'
            },
            location: {
                id: 'loc-farm',
                name: 'Highland Farm',
                latitude: 4.5709,
                longitude: -74.2973,
                address: 'Highland Region, Colombia'
            },
            metadata: {
                seedType: 'Arabica',
                soilType: 'Volcanic'
            },
            verified: true,
            transactionHash: '0x8a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c77'
        },
        {
            id: 'step2',
            productId: '1',
            timestamp: '2023-09-15T08:30:00Z',
            action: 'harvested',
            description: 'Coffee cherries harvested at peak ripeness',
            performedBy: {
                id: 'user1',
                name: 'Juan Valdez',
                role: 'farmer',
                organization: 'Highland Coffee Co-op'
            },
            location: {
                id: 'loc-farm',
                name: 'Highland Farm',
                latitude: 4.5709,
                longitude: -74.2973,
                address: 'Highland Region, Colombia'
            },
            temperature: 22,
            humidity: 68,
            verified: true,
            transactionHash: '0x4c9a7b9b7b3a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700c88a'
        },
        {
            id: 'step3',
            productId: '1',
            timestamp: '2023-09-20T10:15:00Z',
            action: 'processed',
            description: 'Coffee beans extracted from cherries and dried',
            performedBy: {
                id: 'user2',
                name: 'Carlos Rodriguez',
                role: 'processor',
                organization: 'Bean Processing Co.'
            },
            location: {
                id: 'loc-proc',
                name: 'Processing Plant',
                latitude: 4.6097,
                longitude: -74.0817,
                address: 'Bogotá, Colombia'
            },
            temperature: 26,
            humidity: 55,
            certificates: [
                {
                    id: 'cert1',
                    name: 'Organic Processing',
                    issuedBy: 'Organic Farmers Association',
                    issuedDate: '2023-09-12T10:00:00Z',
                    expiryDate: '2024-09-12T10:00:00Z',
                    status: 'valid'
                }
            ],
            verified: true,
            transactionHash: '0x2a7d56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700f19'
        },
        {
            id: 'step4',
            productId: '1',
            timestamp: '2023-09-25T13:20:00Z',
            action: 'packaged',
            description: 'Coffee beans roasted and packaged in eco-friendly bags',
            performedBy: {
                id: 'user3',
                name: 'Maria Gonzalez',
                role: 'processor',
                organization: 'Bean Packaging Co.'
            },
            location: {
                id: 'loc-pack',
                name: 'Packaging Facility',
                latitude: 4.6097,
                longitude: -74.0817,
                address: 'Bogotá, Colombia'
            },
            verified: true,
            transactionHash: '0x6a5f16c5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700e33'
        },
        {
            id: 'step5',
            productId: '1',
            timestamp: '2023-10-10T08:00:00Z',
            action: 'shipped',
            description: 'Products shipped to USA via container ship',
            performedBy: {
                id: 'user4',
                name: 'Global Logistics',
                role: 'distributor',
                organization: 'International Shipping Ltd.'
            },
            location: {
                id: 'loc-ship',
                name: 'Cartagena Port',
                latitude: 10.3910,
                longitude: -75.4794,
                address: 'Cartagena, Colombia'
            },
            temperature: 24,
            humidity: 60,
            verified: true,
            transactionHash: '0x3c8d17b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700b55'
        },
        {
            id: 'step6',
            productId: '1',
            timestamp: '2023-10-20T14:30:00Z',
            action: 'delivered',
            description: 'Product received at distributor warehouse',
            performedBy: {
                id: 'user5',
                name: 'US Distribution Co.',
                role: 'distributor',
                organization: 'East Coast Distribution'
            },
            location: {
                id: 'loc1',
                name: 'Distributor Warehouse',
                latitude: 40.7128,
                longitude: -74.0060,
                address: '123 Distribution Way, New York, NY'
            },
            verified: true,
            transactionHash: '0x9b8c56b5dc63a8e3c8bf01f3f4cd5d49f7d82439f9bc17869d8b861549700a22'
        }
    ],
    status: 'delivered',
    farmer: {
        username: 'farm1',
        name: 'Highland Coffee Co-op',
        organization: 'Highland Farmers Association'
    },
    retailPrice: 12.99,
    verificationCount: 367,
    lastVerified: '2023-11-20T14:22:10Z'
};

// Mock user for testing
// const mockUser = {
//     name: 'John Farmer',
//     role: 'farmer'
// };

const ProductDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'timeline' | 'certificates' | 'details'>('timeline');
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link to="/products" className="inline-flex items-center text-accent hover:underline">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Products
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold mb-1">{mockProduct.name}</h1>
                                    <div className="flex items-center">
                                        <span className="text-sm text-neutral-500 mr-2">ID: {mockProduct.batchId}</span>
                                        <div className="verified-badge">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button className="btn btn-outline">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        Share
                                    </button>
                                    <button className="btn btn-primary">
                                        <Download className="h-4 w-4 mr-1" />
                                        Certificate
                                    </button>
                                </div>
                            </div>

                            <p className="text-neutral-700 mb-6">{mockProduct.description}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Current Location</h4>
                                    <p className="text-xs text-neutral-500">{mockProduct.currentLocation.name}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Created On</h4>
                                    <p className="text-xs text-neutral-500">{new Date(mockProduct.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <User className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Producer</h4>
                                    <p className="text-xs text-neutral-500">{mockProduct.farmer.name}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Retail Price</h4>
                                    <p className="text-xs text-neutral-500">${mockProduct.retailPrice?.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-neutral-200 mb-6">
                                <nav className="flex space-x-8">
                                    <button
                                        className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                            activeTab === 'timeline'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                        }`}
                                        onClick={() => setActiveTab('timeline')}
                                    >
                                        Supply Chain
                                    </button>

                                    <button
                                        className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                            activeTab === 'certificates'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                        }`}
                                        onClick={() => setActiveTab('certificates')}
                                    >
                                        Certificates
                                    </button>

                                    <button
                                        className={`py-4 px-1 text-sm font-medium border-b-2 ${
                                            activeTab === 'details'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                        }`}
                                        onClick={() => setActiveTab('details')}
                                    >
                                        Details
                                    </button>
                                </nav>
                            </div>

                            {/* Tab content */}
                            <div>
                                {activeTab === 'timeline' && (
                                    <SupplyChainTimeline steps={mockProduct.supplyChain} />
                                )}

                                {activeTab === 'certificates' && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Product Certificates</h3>

                                        <div className="space-y-4">
                                            {mockProduct.certificates.map(cert => (
                                                <div key={cert.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h4 className="font-semibold text-lg mb-1">{cert.name}</h4>
                                                            <p className="text-neutral-600 text-sm">Issued by: {cert.issuedBy}</p>
                                                        </div>
                                                        <div className="bg-success bg-opacity-10 h-fit px-3 py-1 rounded-full text-success text-xs font-medium">
                                                            {cert.status}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
                                                        <div className="mb-2 sm:mb-0">
                                                            <p className="text-xs text-neutral-500">Issued Date</p>
                                                            <p className="text-sm">{new Date(cert.issuedDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-neutral-500">Expiry Date</p>
                                                            <p className="text-sm">{new Date(cert.expiryDate).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <button className="btn btn-outline btn-sm mt-2">
                                                                <Download className="h-3 w-3 mr-1" />
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Product Details</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Product Type</h4>
                                                    <p>{mockProduct.type}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Batch ID</h4>
                                                    <p>{mockProduct.batchId}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Created Date</h4>
                                                    <p>{new Date(mockProduct.createdAt).toLocaleString()}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Current Status</h4>
                                                    <p className="capitalize">{mockProduct.status}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Producer</h4>
                                                    <p>{mockProduct.farmer.name}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Organization</h4>
                                                    <p>{mockProduct.farmer.organization}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Current Location</h4>
                                                    <p>{mockProduct.currentLocation.address}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Retail Price</h4>
                                                    <p>${mockProduct.retailPrice?.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-sm font-medium text-neutral-500 mb-2">Verification Statistics</h4>
                                            <div className="bg-neutral-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm">Total Verifications</p>
                                                        <p className="text-lg font-semibold">{mockProduct.verificationCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm">Last Verified</p>
                                                        <p className="text-neutral-600">
                                                            {mockProduct.lastVerified
                                                                ? new Date(mockProduct.lastVerified).toLocaleString()
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 p-4 border border-warning-light border-l-4 bg-warning bg-opacity-5 rounded">
                                            <div className="flex">
                                                <Info className="h-5 w-5 text-warning mr-3 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-medium mb-1">Blockchain Verification</h4>
                                                    <p className="text-sm text-neutral-600">
                                                        This product's journey is permanently recorded on the blockchain. Each step can be independently verified by anyone with the product ID or QR code.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="card mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">Product QR Code</h3>
                                <Link to="/verify" className="text-accent text-sm hover:underline">Verify</Link>
                            </div>

                            <div className="bg-white border border-neutral-200 rounded-lg p-4 flex justify-center">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                    alt="Product QR Code"
                                    className="h-40 w-40"
                                />
                            </div>

                            <p className="text-center text-sm text-neutral-500 mt-3">
                                Scan to verify authenticity
                            </p>

                            <button className="btn btn-outline w-full mt-4">
                                <Download className="h-4 w-4 mr-1" />
                                Download QR Code
                            </button>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Blockchain Info</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Product ID</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono">{mockProduct.id}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Latest Transaction</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono truncate">
                                        {mockProduct.supplyChain[mockProduct.supplyChain.length - 1]?.transactionHash || 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Blockchain</h4>
                                    <p className="text-sm">Ethereum</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Smart Contract</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono">0x7D5b23a11aF58EE560427B571ddA74b52F2Da77E</p>
                                </div>
                            </div>

                            <Link
                                to="https://etherscan.io"
                                className="btn btn-primary w-full mt-6"
                            >
                                View on Blockchain Explorer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductDetail;