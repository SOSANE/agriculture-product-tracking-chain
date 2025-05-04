import React from 'react';
import { Package, PackagePlus, Shield, ShieldCheck, UserCog, UserPlus, Users } from 'lucide-react';
import {Link} from "react-router-dom";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";

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

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{ height: 'fit-content', minHeight: '100%' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Certified products</h2>
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-neutral-600">All recent certified products</p>
                        </div>
                    </div>

                    <div>
                        <div className="card" style={{ height: 'fit-content' }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <UserCog className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-4">
                                <Link to="/manage-accounts" className="btn btn-primary w-full justify-start">
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
            </div>
        </DashboardLayout>
    );
};

export default AdministratorDashboard;