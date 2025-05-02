import React from 'react';
import { Leaf, Package, PackagePlus, QrCode, Shield, ShieldCheck, ShoppingBag, Truck, UserCog, UserPlus, Users } from 'lucide-react';
import MetricsRow from "../../components/dashboard/MetricsRow.tsx";
import { mockMetrics } from "../Analytics.tsx"
import {Link} from "react-router-dom";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";

// Using mock metrics data (temporary)
const AdministratorDashboard: React.FC = () => {
    const { user } = useUserProfile();
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">
                        {user ? `${user.name}'s Dashboard` : 'Administrator Dashboard'}
                    </h1>
                    <p className="text-neutral-600">
                        {user ? `Welcome back, ${user.name}! Manage products or accounts as an administrator` : 'Manage products or accounts'}
                    </p>
                    {user && (
                        <div className="mt-2 text-sm text-neutral-500">
                            Logged in as {user.role} ({user.email || 'no email'})
                        </div>
                    )}
                </header>

                <section className="mb-10">
                    <MetricsRow metrics={mockMetrics} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{ height: 'fit-content', minHeight: '100%' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Recent Activity</h2>
                                <Link to="/activity" className="text-accent hover:underline">View All Activity</Link>
                            </div>

                            <div className="overflow-y-auto" style={{ maxHeight: '282px' }}>
                                <div className="space-y-4 pr-2">
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
                        </div>
                    </div>

                    <div>
                        <div className="card" style={{ height: 'fit-content' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <UserCog className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-4">
                                <Link to="/manage-users" className="btn btn-primary w-full justify-start">
                                    <Users className="h-5 w-5 mr-2" />
                                    Manage Users
                                </Link>

                                <Link to="/manage-products" className="btn btn-accent w-full justify-start">
                                    <Package className="h-5 w-5 mr-2" />
                                    Manage Products
                                </Link>

                                <Link to="/manage-certificates" className="btn btn-secondary w-full justify-start">
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Manage Certificates
                                </Link>

                                <Link to="/add-account" className="btn btn-outline w-full justify-start">
                                    <UserPlus className="h-5 w-5 mr-2" />
                                    Add New Account
                                </Link>

                                <Link to="/add-product" className="btn btn-outline w-full justify-start">
                                    <PackagePlus className="h-5 w-5 mr-2" />
                                    Add New Product
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Certified products</h2>
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">All recent certified products</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdministratorDashboard;