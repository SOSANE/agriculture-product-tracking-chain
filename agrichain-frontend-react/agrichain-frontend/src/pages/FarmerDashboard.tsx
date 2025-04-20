import React from 'react';
import Layout from '../components/layout/Layout';
import { Leaf } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Farmer', role: 'farmer' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Farmer Dashboard</h1>
                    <p className="text-neutral-600">Manage your agricultural products</p>
                </header>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">My Products</h2>
                        <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No products registered yet</p>
                </div>
            </div>
        </Layout>
    );
};

export default FarmerDashboard;