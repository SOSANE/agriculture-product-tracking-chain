import React from "react";
import { useUserProfile } from '../../hooks/useUserProfile';
import Layout from '../layout/Layout';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link, Navigate } from "react-router-dom";
import { Product } from "../../types";
import ProductCard from "../product/ProductCard";
import {Leaf, QrCode, ShoppingBag, Truck} from "lucide-react";
import {useProducts} from "../../hooks/useProducts.ts";

interface DashboardLayoutProps {
    children?: React.ReactNode;
    showProducts?: boolean;
    showRecentProducts?: boolean;
    customProductView?: (products: Product[]) => React.ReactNode;
}

export const DashboardLayout = ({ children, showProducts = true, showRecentProducts = true, customProductView }: DashboardLayoutProps) => {
    const { user, loading, error } = useUserProfile();
    const { products, productsLoading, productsError } = useProducts();

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Profile Load Error</Alert.Heading>
                    <p>{error.message}</p>
                    <p className="mb-0">Please refresh or try again later.</p>
                </Alert>
            </div>
        );
    }

    if (!user) return <Navigate to="/" />;

    const renderProducts = () => {
        if (productsLoading) {
            return (
                <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading products...</span>
                    </Spinner>
                </div>
            );
        }

        if (productsError) {
            return (
                <Alert variant="danger" className="mb-4">
                    {productsError}
                </Alert>
            );
        }

        if (products.length === 0) {
            return (
                <div className="text-center py-5">
                    <p>No products found</p>
                    {user?.role === 'farmer' && (
                        <Link to="/products/new" className="btn btn-primary">
                            Add Your First Product
                        </Link>
                    )}
                </div>
            );
        }

        if (customProductView) {
            return customProductView(products);
        }

        return (
            <section className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        );
    };

    return (
        <Layout user={user}>
            {children}
            {showProducts && (
                <div className="container mx-auto px-4 py-8">
                    <section className="mb-10">
                        {showRecentProducts && (
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Recent Products</h2>
                                <Link to="/products" className="text-accent hover:underline">View All Products</Link>
                            </div>
                        )}
                        {renderProducts()}

                        <section>
                            <div className="card h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                                    <Link to="/activity" className="text-accent hover:underline">View All Activity</Link>
                                </div>

                                <div className="space-y-4">
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
                        </section>
                    </section>
                </div>
            )}
        </Layout>
    );
};