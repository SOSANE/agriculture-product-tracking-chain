import React from 'react';
import {Package, PackagePlus, Shield, ShieldCheck, UserPlus, Users} from 'lucide-react';
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {useCertificates} from "../../hooks/useCertificates.ts";
import NavigationCard from "../../components/NavigationCard.tsx";
import Header from "../../components/Header";

const AdministratorDashboard: React.FC = () => {
    const {user} = useUserProfile();
    const {certificates, certificatesLoading} = useCertificates();

    const buttons = [{
        icon: Users,
        link: "/users",
        text: "Manage Users",
        class: "btn btn-primary w-full justify-start"
    }, {
        icon: Package,
        link: "/manage-products",
        text: "Manage Products",
        class: "btn btn-accent w-full justify-start"
    }, {
        icon: ShieldCheck,
        link: "/manage-certificates",
        text: "Manage Certificates",
        class: "btn btn-secondary w-full justify-start"
    }, {
        icon: UserPlus,
        link: "/add-account",
        text: "Add New Account",
        class: "btn btn-outline w-full justify-start"
    }, {
        icon: PackagePlus,
        link: "/add-product",
        text: "Add New Product",
        class: "btn btn-outline w-full justify-start"
    }];

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <Header user={user} altHeader='Administrator Dashboard'
                        text='Manage products or accounts as an administrator' altText='Manage products or accounts'/>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="card lg:col-span-2 overflow-x-auto pb-6" style={{maxHeight: '398px'}}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">All Certified Products</h2>
                            <Shield className="h-6 w-6 text-primary"/>
                        </div>
                        <div>
                            <div className="space-y-4 pr-2">
                                {certificatesLoading ? (
                                    <div className="flex justify-center py-8">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </div>
                                ) : certificates.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-neutral-600 mb-4">No certification issued yet</p>
                                    </div>
                                ) : (
                                    certificates.map((certificate) => (
                                        <div key={certificate.id}
                                             className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-1">{certificate.name}</h4>
                                                    <p className="text-neutral-600 text-sm">Issued
                                                        by: {certificate.issuedBy}</p>
                                                </div>
                                                <div
                                                    className="bg-success bg-opacity-10 h-fit px-3 py-1 rounded-full text-success text-xs font-medium">
                                                    {certificate.status}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between">
                                                <div className="mb-2 sm:mb-0">
                                                    <p className="text-xs text-neutral-500">Issued Date</p>
                                                    <p className="text-sm">{new Date(certificate.issuedDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-500">Expiry Date</p>
                                                    <p className="text-sm">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <NavigationCard buttons={buttons} isAdmin={true}/>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default AdministratorDashboard;