import React from 'react';
import {ClipboardList, Package, QrCode, ShieldCheck, Truck} from 'lucide-react';
import {Link} from "react-router-dom";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";

const DistributorDashboard: React.FC = () => {
    const { user } = useUserProfile();
    return (
        <DashboardLayout >
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">
                        {user ? `${user.name}'s Dashboard` : 'Distributor Dashboard'}
                    </h1>
                    <p className="text-neutral-600">
                        {user ? `Welcome back, ${user.name}! Manage product distribution as a distributor` : 'Manage product distribution'}
                    </p>
                    {user && (
                        <div className="mt-2 text-sm text-neutral-500">
                            Logged in as {user.role} ({user.email || 'no email'})
                        </div>
                    )}
                </header>

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

                                <Link to="/products-details" className="btn btn-accent w-full justify-start">
                                    <Package className="h-5 w-5 mr-2" />
                                    Update Product Details
                                </Link>

                                <Link to="/send-request" className="btn btn-secondary w-full justify-start">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Send Certification Request
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default DistributorDashboard;