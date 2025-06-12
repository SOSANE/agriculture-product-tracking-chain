import React from 'react';
import {Leaf, Package, PackagePlus, ShieldCheck} from 'lucide-react';
import {Link} from "react-router-dom";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {useProducts} from "../../hooks/useProducts.ts";
import NavigationCard from "../../components/NavigationCard";
import Header from "../../components/Header";

const FarmerDashboard: React.FC = () => {
    const {user} = useUserProfile();
    const {products, productsLoading} = useProducts();

    const buttons = [{
        icon: PackagePlus,
        link: "/add-product",
        text: "Add New Product",
        class: "btn btn-primary w-full justify-start"
    }, {
        icon: Package,
        link: "/manage-products",
        text: "Manage My Products",
        class: "btn btn-accent w-full justify-start"
    }, {
        icon: ShieldCheck,
        link: "/send-request",
        text: "Send Certification Request",
        class: "btn btn-secondary w-full justify-start"
    }];

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <Header user={user} altHeader='Farmer Dashboard' text='Manage your agricultural products as a farmer'
                        altText='Manage your agricultural products'/>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{height: 'fit-content', minHeight: '100%'}}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">My Products</h2>
                                <Leaf className="h-6 w-6 text-primary"/>
                            </div>

                            {productsLoading ? (
                                <div className="flex justify-center py-8">
                                    <span className="loading loading-spinner text-primary"></span>
                                </div>
                            ) : (
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
                                                                    <img src={product.imageUrl} alt={product.name}/>
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


                    <NavigationCard buttons={buttons} isAdmin={false}/>

                </section>
            </div>
        </DashboardLayout>
    );
};

export default FarmerDashboard;