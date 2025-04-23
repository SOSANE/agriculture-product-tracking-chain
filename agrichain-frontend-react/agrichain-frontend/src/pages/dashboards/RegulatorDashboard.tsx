import React from 'react';
import Layout from '../../components/layout/Layout.tsx';
import { ArrowRight, Leaf, QrCode, Shield, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import MetricsRow from "../../components/dashboard/MetricsRow.tsx";
import {mockMetrics} from "../Analytics.tsx";
import {Link} from "react-router-dom";

// Using mock data (temporary)
const RegulatorDashboard: React.FC = () => {
    return (
        <Layout user={{ name: 'Regulator', role: 'regulator' }}>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Regulator Dashboard</h1>
                    <p className="text-neutral-600">Manage and oversee agricultural certifications</p>
                </header>

                <section className="mb-10">
                    <MetricsRow metrics={mockMetrics} />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="card h-full flex flex-col">
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
                    <div className="card h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Products I've Certified</h2>
                            <Shield className="h-6 w-6 text-primary" />
                        </div>

                        <div className="overflow-y-auto flex-grow pr-2" style={{ maxHeight: '282px' }}>
                            <div className="space-y-4 pr-2">
                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="bg-secondary bg-opacity-10 p-2 rounded-full">
                                        <ShieldCheck className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Certificate Issued</p>
                                        <p className="text-sm text-neutral-600">Wild Honey received Organic Certification</p>
                                        <p className="text-xs text-neutral-500 mt-1">2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Certificate Issued</p>
                                        <p className="text-sm text-neutral-600">Organic Coffee Beans received Organic Certification</p>
                                        <p className="text-xs text-neutral-500 mt-1">3 days ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="bg-success bg-opacity-10 p-2 rounded-full">
                                        <ShieldCheck className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Certificate Issued</p>
                                        <p className="text-sm text-neutral-600">Premium Rice received Organic Certification</p>
                                        <p className="text-xs text-neutral-500 mt-1">3 days ago</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="bg-accent bg-opacity-10 p-2 rounded-full">
                                        <ShieldCheck className="h-5 w-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Certificate Issued</p>
                                        <p className="text-sm text-neutral-600">Fresh Avocados received Organic Certification</p>
                                        <p className="text-xs text-neutral-500 mt-1">3 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-3 border-t border-neutral-100">
                            <Link to="/regulator/certification-request" className="btn btn-outline group relative flex items-center justify-between w-full px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-light focus:ring-opacity-50">
                                <div className="flex items-center">
                                    <span>See My Certification Requests</span>
                                </div>
                                <div className="w-5 h-5 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    <ArrowRight className="w-full h-full" />
                                </div>
                            </Link>
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
        </Layout>
    );
};

export default RegulatorDashboard;