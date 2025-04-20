import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-neutral-800 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand and description */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <Box className="h-7 w-7 text-primary-light" />
                            <span className="ml-2 text-xl font-semibold">AgriChain</span>
                        </div>
                        <p className="text-neutral-300 mb-4">
                            Bringing transparency and trust to agricultural supply chains through blockchain technology.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="#" className="text-neutral-300 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-neutral-300 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-neutral-300 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link to="#" className="text-neutral-300 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/dashboard" className="text-neutral-300 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-neutral-300 hover:text-white transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/verify" className="text-neutral-300 hover:text-white transition-colors">
                                    Verify Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/analytics" className="text-neutral-300 hover:text-white transition-colors">
                                    Analytics
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/docs" className="text-neutral-300 hover:text-white transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-neutral-300 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/faqs" className="text-neutral-300 hover:text-white transition-colors">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-neutral-300 hover:text-white transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <address className="not-italic text-neutral-300">
                            <p>1234 Blockchain Way</p>
                            <p>Agricity, AC 98765</p>
                            <p className="mt-2">
                                <Link to="mailto:info@agrichain.com" className="hover:text-white transition-colors">
                                    info@agrichain.com
                                </Link>
                            </p>
                            <p>
                                <Link to="tel:+1-234-567-8900" className="hover:text-white transition-colors">
                                    +1-234-567-8900
                                </Link>
                            </p>
                        </address>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-700">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-neutral-400 text-sm">
                            &copy; {new Date().getFullYear()} AgriChain. All rights reserved.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <Link to="/privacy" className="text-neutral-400 text-sm hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-neutral-400 text-sm hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/cookies" className="text-neutral-400 text-sm hover:text-white transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;