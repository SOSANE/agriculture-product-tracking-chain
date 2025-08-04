import React from 'react';
import {ArrowRight, Shield} from 'lucide-react';
import {Link} from "react-router-dom";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {useCertificates} from "../../hooks/useCertificates.ts";
import Header from "../../components/Header";

const RegulatorDashboard: React.FC = () => {
    const {user} = useUserProfile();
    const {certificates, certificatesLoading} = useCertificates();

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <Header user={user} altHeader='Regulator Dashboard'
                        text='Manage and oversee agricultural certifications as a regulator'
                        altText='Manage and oversee agricultural certifications'/>
                <section>
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold mb-4">Products I've Certified</h3>
                            <Shield className="h-6 w-6 text-primary"/>
                        </div>

                        <div className="overflow-y-auto flex-grow pr-2" style={{maxHeight: '282px'}}>
                            <div className="space-y-4 pr-2">
                                {certificatesLoading ? (
                                    <div className="flex justify-center py-8">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </div>
                                ) : certificates.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-neutral-600 mb-4">No certification issued yet</p>
                                    </div>
                                ) : (certificates.map((certificate) => (
                                        <div key={certificate.id}
                                             className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-1">{certificate.name}</h4>
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

                        <div className="mt-auto pt-3 border-t border-neutral-100">
                            <Link to="/certification-request"
                                  className="btn btn-outline group relative flex items-center justify-between w-full px-4 py-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 focus:ring-2 focus:ring-primary-light focus:ring-opacity-50">
                                <div className="flex items-center">
                                    <span>See My Certification Requests</span>
                                </div>
                                <div className="w-5 h-5 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    <ArrowRight className="w-full h-full"/>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default RegulatorDashboard;