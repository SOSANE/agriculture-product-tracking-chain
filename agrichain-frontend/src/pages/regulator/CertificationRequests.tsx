import React from "react";
import {Shield} from "lucide-react";
import {useUserProfile} from "../../hooks/useUserProfile.ts";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";

const CertificationRequest: React.FC = () => {
    const { user } = useUserProfile();
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Pending Certifications</h2>
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-neutral-600">No pending certifications to review</p>
                    {user && (
                        <div className="mt-2 text-sm text-neutral-500">
                            Logged in as {user.role} ({user.email || 'no email'})
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CertificationRequest;