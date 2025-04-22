import React from 'react';
import Layout from '../components/layout/Layout';
import { UserCog } from 'lucide-react';

const AdministratorDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Administrator', role: 'administrator' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Administrator Dashboard</h1>
                    <p className="text-neutral-600">Manage products or accounts</p>
                </header>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Recent Activities</h2>
                        <UserCog className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No recent activities</p>
                </div>
            </div>
        </Layout>
    );
};

export default AdministratorDashboard;