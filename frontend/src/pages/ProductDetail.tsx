import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Info, Download, Share2, ArrowLeft, MapPin, Calendar, User, DollarSign } from 'lucide-react';
import SupplyChainTimeline from '../components/product/SupplyChainTimeline';
import { Product } from '../types';
import { DashboardLayout } from "../components/layout/DashboardLayout";
import {downloadQrCode} from "../services/productService.ts";

const ProductDetail: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'timeline' | 'certificates' | 'details'>('timeline');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

    useEffect(() => {
        console.log('Fetching product with ID:', id); // Debug log
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${id}`, {
                    credentials: 'include'
                });

                console.log('Response status:', response.status); // Debug log

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Error response data:', errorData); // Debug log
                    throw new Error(
                        errorData.message ||
                        `Failed to fetch product (Status: ${response.status})`
                    );
                }

                const data = await response.json();
                console.log('Fetched product data:', data); // Debug log
                setProduct(data);
            } catch (err) {
                console.error('Full error:', err); // Debug log
                const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
                setError(errorMessage);
                console.error('Error details:', {
                    message: errorMessage,
                    error: err,
                    productId: id
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="alert alert-error">
                        <div className="flex-1">
                            <label>{error}</label>
                        </div>
                    </div>
                    <Link to="/dashboard" className="btn btn-primary mt-4">
                        Back to Dashboard
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    if (!product) {
        return (
            <DashboardLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="alert alert-warning">
                        <div className="flex-1">
                            <label>Product not found</label>
                        </div>
                    </div>
                    <Link to="/dashboard" className="btn btn-primary mt-4">
                        Back to Dashboard
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center text-accent hover:underline">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="card">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
                                    <div className="flex items-center">
                                        <span className="text-sm text-neutral-500 mr-2">ID: {product.batchId}</span>
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

                            <p className="text-neutral-700 mb-6">{product.description}</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <MapPin className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Current Location</h4>
                                    <p className="text-xs text-neutral-500">{product.currentLocation.name}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <Calendar className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Created On</h4>
                                    <p className="text-xs text-neutral-500">{new Date(product.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <User className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Producer</h4>
                                    <p className="text-xs text-neutral-500">{product.farmer.name}</p>
                                </div>

                                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                                    <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
                                    <h4 className="text-sm font-medium mb-1">Retail Price</h4>
                                    <p className="text-xs text-neutral-500">{product.retailPrice ? '$'+product.retailPrice : 'N/A'}</p>
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
                                    <SupplyChainTimeline steps={product.supplyChain} />
                                )}

                                {activeTab === 'certificates' && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Product Certificates</h3>

                                        <div className="space-y-4">
                                            {product.certificates.map(cert => (
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
                                                    <p>{product.type}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Batch ID</h4>
                                                    <p>{product.batchId}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Created Date</h4>
                                                    <p>{new Date(product.createdAt).toLocaleString()}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Current Status</h4>
                                                    <p className="capitalize">{product.status}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Producer</h4>
                                                    <p>{product.farmer.name}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Organization</h4>
                                                    <p>{product.farmer.organization}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Current Location</h4>
                                                    <p>{product.currentLocation.address}</p>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-medium text-neutral-500">Retail Price</h4>
                                                    <p>{product.retailPrice ? '$'+product.retailPrice : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h4 className="text-sm font-medium text-neutral-500 mb-2">Verification Statistics</h4>
                                            <div className="bg-neutral-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm">Total Verifications</p>
                                                        <p className="text-lg font-semibold">{product.verificationCount}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm">Last Verified</p>
                                                        <p className="text-neutral-600">
                                                            {product.lastVerified
                                                                ? new Date(product.lastVerified).toLocaleString()
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
                                <img src={product.qrImage}
                                    alt="Product QR Code"
                                    className="h-40 w-40"
                                />
                            </div>

                            <p className="text-center text-sm text-neutral-500 mt-3">
                                Scan to verify authenticity
                            </p>

                            <button onClick={() => downloadQrCode(product.id, product.qrImage)} className="btn btn-outline w-full mt-4">
                                <Download className="h-4 w-4 mr-1" />
                                Download QR Code
                            </button>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Blockchain Info</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Product ID</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono">{product.id}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Latest Transaction</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono truncate">
                                        {product.supplyChain[product.supplyChain.length - 1]?.transactionHash || 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Blockchain</h4>
                                    <p className="text-sm">Ethereum</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-neutral-500">Smart Contract</h4>
                                    <p className="text-sm text-neutral-800 break-all font-mono">{contractAddress ?? 'N/A'}</p>
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