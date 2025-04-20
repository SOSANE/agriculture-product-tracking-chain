import React from 'react';
import Layout from '../components/layout/Layout';
import { Truck } from 'lucide-react';

const DistributorDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Distributor', role: 'distributor' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Distributor Dashboard</h1>
                    <p className="text-neutral-600">Manage product distribution</p>
                </header>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Active Shipments</h2>
                        <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No active shipments</p>
                </div>
            </div>
        </Layout>
    );
};

export default DistributorDashboard;