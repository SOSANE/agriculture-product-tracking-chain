import React from 'react';
import Layout from '../../components/layout/Layout.tsx';
import {ClipboardList, Leaf, Package, PackagePlus, ShieldCheck} from 'lucide-react';
import MetricsRow from "../../components/dashboard/MetricsRow.tsx";
import {mockMetrics, mockRecentProducts} from "../Analytics.tsx";
import {Link} from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.tsx";

// Using mock data (temporary)
const FarmerDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Farmer', role: 'farmer' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Farmer Dashboard</h1>
                    <p className="text-neutral-600">Manage your agricultural products</p>
                </header>

                <section className="mb-10">
                    <MetricsRow metrics={mockMetrics} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{ height: 'fit-content', minHeight: '100%' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">My Products</h2>
                                <Leaf className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-neutral-600">No products registered yet</p>
                        </div>
                    </div>

                    <div>
                        <div className="card h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <ClipboardList className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-4">
                                <Link to="/farmer/add-product" className="btn btn-primary w-full justify-start">
                                    <PackagePlus className="h-5 w-5 mr-2" />
                                    Add New Product
                                </Link>

                                <Link to="/farmer/manage-products" className="btn btn-accent w-full justify-start">
                                    <Package className="h-5 w-5 mr-2" />
                                    Manage My Products
                                </Link>

                                <Link to="/farmer/send-request" className="btn btn-secondary w-full justify-start">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Send Certification Request
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
            </div>
        </Layout>
    );
};

export default FarmerDashboard;