import React from 'react';
import Layout from '../../components/layout/Layout.tsx';
import {ClipboardList, Package, QrCode, ShieldCheck, Truck} from 'lucide-react';
import MetricsRow from "../../components/dashboard/MetricsRow.tsx";
import {mockMetrics, mockRecentProducts} from "../Analytics.tsx";
import {Link} from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.tsx";

// Using mock data (temporary)
const DistributorDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Distributor', role: 'distributor' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Distributor Dashboard</h1>
                    <p className="text-neutral-600">Manage product distribution</p>
                </header>

                <section className="mb-10">
                    <MetricsRow metrics={mockMetrics} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{ height: 'fit-content', minHeight: '100%' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Active Shipments</h2>
                                <Truck className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-neutral-600">No active shipments</p>
                        </div>
                    </div>

                    <div>
                        <div className="card h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <ClipboardList className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-4">
                                <Link to="/verify" className="btn btn-primary w-full justify-start">
                                    <QrCode className="h-5 w-5 mr-2" />
                                    Scan New Product
                                </Link>

                                <Link to="/distributor/products-details" className="btn btn-accent w-full justify-start">
                                    <Package className="h-5 w-5 mr-2" />
                                    Update Product Details
                                </Link>

                                <Link to="/distributor/send-request" className="btn btn-secondary w-full justify-start">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Send Certification Request
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Recent Activities</h2>
                        <Link to="/products" className="text-accent hover:underline">View All Products</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockRecentProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default DistributorDashboard;