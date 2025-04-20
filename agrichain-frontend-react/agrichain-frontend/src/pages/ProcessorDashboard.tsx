import React from 'react';
import Layout from '../components/layout/Layout';
import { Factory } from 'lucide-react';

const ProcessorDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Processor', role: 'processor' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Processor Dashboard</h1>
                    <p className="text-neutral-600">Track processing operations</p>
                </header>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Processing Queue</h2>
                        <Factory className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No items in processing queue</p>
                </div>
            </div>
        </Layout>
    );
};

export default ProcessorDashboard;