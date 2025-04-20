import React from 'react';
import Layout from '../components/layout/Layout';
import { ShoppingBag } from 'lucide-react';

const RetailerDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Retailer', role: 'retailer' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Retailer Dashboard</h1>
                    <p className="text-neutral-600">Manage store inventory</p>
                </header>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Store Inventory</h2>
                        <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No products in inventory</p>
                </div>
            </div>
        </Layout>
    );
};

export default RetailerDashboard;