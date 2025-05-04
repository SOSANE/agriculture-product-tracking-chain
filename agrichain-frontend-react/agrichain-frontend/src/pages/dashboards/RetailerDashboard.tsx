import React from 'react';
import {ClipboardList, Package, PackagePlus, ShoppingBag} from 'lucide-react';
import {Link} from "react-router-dom";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";

const RetailerDashboard: React.FC = () => {
    const { user } = useUserProfile();
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">
                        {user ? `${user.name}'s Dashboard` : 'Retailer Dashboard'}
                    </h1>
                    <p className="text-neutral-600">
                        {user ? `Welcome back, ${user.name}! Manage store inventory as a retailer` : 'Manage store inventory'}
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
                                <h2 className="text-xl font-semibold">Store Inventory</h2>
                                <ShoppingBag className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-neutral-600">No products in inventory</p>
                        </div>
                    </div>

                    <div>
                        <div className="card h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                                <ClipboardList className="h-6 w-6 text-primary" />
                            </div>

                            <div className="space-y-4">
                                <Link to="/add-product" className="btn btn-primary w-full justify-start">
                                    <PackagePlus className="h-5 w-5 mr-2" />
                                    Add New Product
                                </Link>

                                <Link to="/manage-products" className="btn btn-accent w-full justify-start">
                                    <Package className="h-5 w-5 mr-2" />
                                    Manage My Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default RetailerDashboard;