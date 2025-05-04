import React from 'react';
import {ClipboardList, Leaf, Package, PackagePlus, ShieldCheck} from 'lucide-react';
import {Link} from "react-router-dom";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {useProducts} from "../../hooks/useProducts.ts";

const FarmerDashboard: React.FC = () => {
    const { user } = useUserProfile();
    const { products, productsLoading } = useProducts();

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">
                        {user ? `${user.name}'s Dashboard` : 'Farmer Dashboard'}
                    </h1>
                    <p className="text-neutral-600">
                        {user ? `Welcome back, ${user.name}! Manage your agricultural products as a farmer` : 'Manage your agricultural products'}
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
                                <h2 className="text-xl font-semibold">My Products</h2>
                                <Leaf className="h-6 w-6 text-primary" />
                            </div>

                            {productsLoading ? (
                                <div className="flex justify-center py-8">
                                    <span className="loading loading-spinner text-primary"></span>
                                </div>
                            ) :
                            //     products.length === 0 ? (
                            //     <div className="text-center py-8">
                            //         <p className="text-neutral-600 mb-4">No products registered yet</p>
                            //         <Link to="/add-product" className="btn btn-primary">
                            //             <PackagePlus className="h-5 w-5 mr-2" />
                            //             Add Your First Product
                            //         </Link>
                            //     </div>
                            // ) :
                                (
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Batch ID</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        {product.imageUrl && (
                                                            <div className="avatar">
                                                                <div className="mask mask-squircle w-12 h-12">
                                                                    <img src={product.imageUrl} alt={product.name} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-bold">{product.name}</div>
                                                            <div className="text-sm text-neutral-500">
                                                                Added: {new Date(product.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product.type}</td>
                                                <td>{product.batchId}</td>
                                                <td>
                                                        <span className={`badge ${
                                                            product.status === 'harvested' ? 
                                                                'badge-success' : 
                                                                product.status === 'processed' ? 
                                                                    'badge-warning' : 
                                                                    'badge-neutral'
                                                        }`}>
                                                            {product.status}
                                                        </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/products/${product.id}`}
                                                        className="btn btn-ghost btn-xs"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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

export default FarmerDashboard;