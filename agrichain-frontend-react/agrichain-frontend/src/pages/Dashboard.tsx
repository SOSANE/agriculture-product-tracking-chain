import React from 'react';
import { BarChart2, Leaf, ShoppingBag, TrendingUp, Users, QrCode, Map, Truck } from 'lucide-react';
import Layout from '../components/layout/Layout';
import MetricsRow from '../components/dashboard/MetricsRow';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { DashboardMetric, Product } from '../types';

// Mock data
const mockMetrics: DashboardMetric[] = [
    {
        id: '1',
        title: 'Total Products',
        value: 248,
        change: 12.5,
        changeType: 'positive',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7 A2 2 0 0 1 19 9 L5 9 A2 2 0 0 1 3 7 L3 3 A2 2 0 0 1 5 1 L19 1 A2 2 0 0 1 21 3 Z"></path><path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"></path><path d="M9 17v-6"></path><path d="M15 17v-6"></path></svg>'
    },
    {
        id: '2',
        title: 'Verification Scans',
        value: 1465,
        change: 8.2,
        changeType: 'positive',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg>'
    },
    {
        id: '3',
        title: 'Active Farmers',
        value: 63,
        change: 5.8,
        changeType: 'positive',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 5c0 2.8-2.2 5-5 5a5 5 0 0 1-5-5"></path><path d="M10 2h4"></path><path d="M14 22s-4-2-8-14c4 4 8 4 12 0-4 12-8 14-8 14z"></path></svg>'
    },
    {
        id: '4',
        title: 'Certificates Issued',
        value: 95,
        change: 2.4,
        changeType: 'positive',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"></rect><path d="M21 8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1"></path><path d="M9 14h6"></path><path d="M12 14v4"></path><path d="M3 8v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8"></path></svg>'
    }
];

const mockRecentProducts: Product[] = [
    {
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
        status: 'shipping',
        farmer: {
            id: 'farm1',
            name: 'Highland Coffee Co-op',
            organization: 'Highland Farmers Association'
        },
        retailPrice: 12.99,
        verificationCount: 367,
        lastVerified: '2023-11-20T14:22:10Z'
    },
    {
        id: '2',
        name: 'Premium Rice',
        description: 'High-quality rice grown in sustainable conditions',
        type: 'Grain',
        imageUrl: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        batchId: 'BATCH-RC-2023-042',
        qrCode: 'QR-042',
        createdAt: '2023-10-22T10:15:00Z',
        currentLocation: {
            id: 'loc2',
            name: 'Processing Facility',
            latitude: 36.7783,
            longitude: -119.4179,
            address: '456 Processing Ave, California, CA'
        },
        certificates: [
            {
                id: 'cert2',
                name: 'Sustainable Farming',
                issuedBy: 'Global Sustainable Agriculture',
                issuedDate: '2023-09-05T08:00:00Z',
                expiryDate: '2024-09-05T08:00:00Z',
                status: 'valid'
            }
        ],
        supplyChain: [],
        status: 'processing',
        farmer: {
            id: 'farm2',
            name: 'Valley Rice Growers',
            organization: 'Rice Producers Association'
        },
        retailPrice: 8.99,
        verificationCount: 215,
        lastVerified: '2023-11-18T09:45:30Z'
    },
    {
        id: '3',
        name: 'Fresh Avocados',
        description: 'Farm-fresh avocados harvested at peak ripeness',
        type: 'Produce',
        imageUrl: 'https://images.pexels.com/photos/2228553/pexels-photo-2228553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        batchId: 'BATCH-AV-2023-087',
        qrCode: 'QR-087',
        createdAt: '2023-11-05T07:30:00Z',
        currentLocation: {
            id: 'loc3',
            name: 'Retail Distribution Center',
            latitude: 33.4484,
            longitude: -112.0740,
            address: '789 Distribution Blvd, Phoenix, AZ'
        },
        certificates: [],
        supplyChain: [],
        status: 'delivered',
        farmer: {
            id: 'farm3',
            name: 'Green Valley Farms',
            organization: 'Arizona Growers Coalition'
        },
        retailPrice: 6.49,
        verificationCount: 132,
        lastVerified: '2023-11-19T16:12:45Z'
    },
    {
        id: '4',
        name: 'Wild Honey',
        description: 'Pure, unfiltered honey from wildflower sources',
        type: 'Honey',
        imageUrl: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        batchId: 'BATCH-HN-2023-029',
        qrCode: 'QR-029',
        createdAt: '2023-10-30T11:45:00Z',
        currentLocation: {
            id: 'loc4',
            name: 'Packaging Facility',
            latitude: 40.4406,
            longitude: -79.9959,
            address: '101 Packaging Rd, Pittsburgh, PA'
        },
        certificates: [
            {
                id: 'cert4',
                name: 'Organic Certified',
                issuedBy: 'Organic Farmers Association',
                issuedDate: '2023-08-20T10:00:00Z',
                expiryDate: '2024-08-20T10:00:00Z',
                status: 'valid'
            }
        ],
        supplyChain: [],
        status: 'packaged',
        farmer: {
            id: 'farm4',
            name: 'Sunny Meadows Apiary',
            organization: 'National Beekeepers Association'
        },
        retailPrice: 14.99,
        verificationCount: 198,
        lastVerified: '2023-11-17T13:30:20Z'
    }
];

// Mock user for testing
const mockUser = {
    name: 'John Farmer',
    role: 'farmer'
};

const Dashboard: React.FC = () => {
    return (
        <Layout user={mockUser}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
                    <p className="text-neutral-600">Track and manage your agricultural products in the supply chain</p>
                </header>

                <section className="mb-10">
                    <MetricsRow metrics={mockMetrics} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Supply Chain Map</h2>
                                <button className="btn btn-outline">View All</button>
                            </div>
                            <div className="bg-neutral-100 rounded-lg h-80 flex items-center justify-center">
                                <div className="text-center">
                                    <Map className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                                    <p className="text-neutral-500">Interactive map showing the location of all products in the supply chain</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="card h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                            </div>

                            <div className="space-y-4">
                                <Link to="/products/new" className="btn btn-primary w-full justify-start">
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Add New Product
                                </Link>

                                <Link to="/verify" className="btn btn-accent w-full justify-start">
                                    <QrCode className="h-5 w-5 mr-2" />
                                    Verify Product
                                </Link>

                                <Link to="/certificates" className="btn btn-secondary w-full justify-start">
                                    <Leaf className="h-5 w-5 mr-2" />
                                    Manage Certificates
                                </Link>

                                <Link to="/analytics" className="btn btn-outline w-full justify-start">
                                    <BarChart2 className="h-5 w-5 mr-2" />
                                    View Analytics
                                </Link>

                                <Link to="/users" className="btn btn-outline w-full justify-start">
                                    <Users className="h-5 w-5 mr-2" />
                                    Manage Users
                                </Link>

                                <Link to="/reports" className="btn btn-outline w-full justify-start">
                                    <TrendingUp className="h-5 w-5 mr-2" />
                                    Generate Reports
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Recent Products</h2>
                        <Link to="/products" className="text-accent hover:underline">View All Products</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockRecentProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section>
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Recent Activity</h2>
                            <Link to="/activity" className="text-accent hover:underline">View All Activity</Link>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                                    <QrCode className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Product Verified</p>
                                    <p className="text-sm text-neutral-600">Organic Coffee Beans was verified by Consumer</p>
                                    <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                <div className="bg-success bg-opacity-10 p-2 rounded-full">
                                    <ShoppingBag className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <p className="font-medium">New Product Added</p>
                                    <p className="text-sm text-neutral-600">Premium Rice was added to the blockchain</p>
                                    <p className="text-xs text-neutral-500 mt-1">5 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                <div className="bg-accent bg-opacity-10 p-2 rounded-full">
                                    <Truck className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-medium">Status Updated</p>
                                    <p className="text-sm text-neutral-600">Fresh Avocados status changed to Delivered</p>
                                    <p className="text-xs text-neutral-500 mt-1">1 day ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                <div className="bg-secondary bg-opacity-10 p-2 rounded-full">
                                    <Leaf className="h-5 w-5 text-secondary" />
                                </div>
                                <div>
                                    <p className="font-medium">Certificate Issued</p>
                                    <p className="text-sm text-neutral-600">Wild Honey received Organic Certification</p>
                                    <p className="text-xs text-neutral-500 mt-1">2 days ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Dashboard;