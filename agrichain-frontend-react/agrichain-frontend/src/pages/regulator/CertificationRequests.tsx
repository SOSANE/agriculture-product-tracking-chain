import React from "react";
import Layout from '../../components/layout/Layout.tsx';
import {Shield} from "lucide-react";

const CertificationRequest: React.FC = () => {
    return (
        <Layout user={{ name: 'Regulator', role: 'regulator' }}>
            <div className="container mx-auto px-4 py-8">
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Pending Certifications</h2>
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No pending certifications to review</p>
                </div>
            </div>
        </Layout>
    );
};

export default CertificationRequest;