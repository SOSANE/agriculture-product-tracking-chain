import React from 'react';
import {Factory, Package, QrCode, ShieldCheck} from 'lucide-react';
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import NavigationCard from "../../components/NavigationCard.tsx";
import Header from "../../components/Header";

const ProcessorDashboard: React.FC = () => {
    const {user} = useUserProfile();

    const buttons = [{
        icon: QrCode,
        link: "/verify",
        text: "Scan New Product",
        class: "btn btn-primary w-full justify-start"
    }, {
        icon: Package,
        link: "/products-details",
        text: "Update Product Details",
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
                <Header user={user} altHeader='Processor Dashboard' text='Track processing operations as a processor'
                        altText='Track processing operations'/>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2">
                        <div className="card" style={{height: 'fit-content', minHeight: '100%'}}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Processing Queue</h2>
                                <Factory className="h-6 w-6 text-primary"/>
                            </div>
                            <p className="text-neutral-600">No items in processing queue</p>
                        </div>
                    </div>

                    <NavigationCard buttons={buttons} isAdmin={false}/>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default ProcessorDashboard;