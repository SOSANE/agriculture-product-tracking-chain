import React from 'react';
import { CheckCircle, X, AlertTriangle, Shield } from 'lucide-react';
import { Product } from '../../types';
import { Link } from 'react-router-dom';

interface VerificationResultProps {
    product: Product | null;
    error?: string;
    loading?: boolean;
}

const VerificationResult: React.FC<VerificationResultProps> = ({
                                                                   product,
                                                                   error,
                                                                   loading = false
                                                               }) => {
    if (loading) {
        return (
            <div className="card text-center py-8">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <p className="mt-4 text-neutral-600">Verifying product authenticity...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card border border-error">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-error bg-opacity-10 text-error mb-4">
                        <X className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
                    <p className="text-neutral-600 mb-4">{error}</p>
                    <Link to="/verify" className="btn btn-outline">
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="card border border-warning">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-warning bg-opacity-10 text-warning mb-4">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Product Found</h3>
                    <p className="text-neutral-600 mb-4">
                        We couldn't find any product matching this code. Please check and try again.
                    </p>
                    <Link to="/verify" className="btn btn-outline">
                        Try Another Product
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card border border-success animate-fade-in">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success bg-opacity-10 text-success mb-4">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Product Verified</h3>
                <p className="text-neutral-600">
                    This product has been verified as authentic on the blockchain.
                </p>
            </div>

            <div className="border-t border-b border-neutral-100 py-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-neutral-500">Product Name</span>
                    <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-neutral-500">Batch ID</span>
                    <span className="font-medium">{product.batchId}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-neutral-500">Producer</span>
                    <span className="font-medium">{product.farmer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Current Status</span>
                    <span className="font-medium capitalize">{product.status}</span>
                </div>
            </div>

            {product.certificates.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                        {product.certificates.map((cert) => (
                            <div
                                key={cert.id}
                                className="flex items-center gap-1 px-3 py-2 rounded-full bg-neutral-100"
                            >
                                <Shield className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium">{cert.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between">
                <Link to={`/products/${product.id}`} className="btn btn-primary">
                    View Full Details
                </Link>
                <span className="text-sm text-neutral-500 self-center">
          Verified {product.verificationCount} times
        </span>
            </div>
        </div>
    );
};

export default VerificationResult;