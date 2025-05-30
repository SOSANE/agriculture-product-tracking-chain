import React from 'react';
import {QrCode, LogIn} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';

const Homepage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-light to-primary">
            <div className="container mx-auto px-4 py-12">
                <header className="text-center text-white mb-16">
                    <h1 className="text-5xl font-bold mb-6">AgriChain</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Track and verify agricultural products from farm to table using blockchain technology
                    </p>
                </header>

                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                        <div className="text-center md:text-left flex flex-col h-full">
                            <div className="flex-grow">
                                <h2 className="text-2xl font-semibold mb-4">Verify a Product</h2>
                                <p className="text-neutral-600 mb-8">
                                    Scan any product's QR code to instantly verify its authenticity and trace its
                                    journey
                                </p>
                            </div>
                            <Link
                                to="/verify"
                                className="btn btn-primary inline-flex items-center justify-center text-lg px-8 py-4 min-w-[220px]"
                            >
                                <QrCode className="h-6 w-6 mr-2"/>
                                Scan QR Code
                            </Link>
                        </div>

                        <div
                            className="border-t md:border-l md:border-t-0 border-neutral-200 pt-8 md:pt-0 md:pl-8 flex flex-col h-full">
                            <div className="flex-grow">
                                <h2 className="text-2xl font-semibold mb-4">Stakeholder Login</h2>
                                <p className="text-neutral-600 mb-8">
                                    Sign in as a stakeholder
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white inline-flex items-center justify-center text-lg px-8 py-4 min-w-[220px]"
                            >
                                <LogIn className="h-6 w-6 mr-2"/>
                                Login
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 text-center text-white">
                    <div className="opacity-80 text-sm">
                        <Link to="/privacy" className="hover:underline mx-2">Privacy Policy</Link>
                        <span>•</span>
                        <Link to="/terms" className="hover:underline mx-2">Terms of Service</Link>
                        <span>•</span>
                        <Link to="/about" className="hover:underline mx-2">About</Link>
                    </div>
                    <p className="mt-4 opacity-60 text-sm">
                        © {new Date().getFullYear()} AgriChain. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Homepage;