import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {UserRole} from "../../types";
import {registerAccount} from "../../services/addAccountService.ts";

const AddAccount: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        organization: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        role: 'farmer',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        try {
            const response = await registerAccount(
                formData.name,
                formData.username,
                formData.email,
                formData.password,
                formData.confirmPassword,
                formData.organization,
                formData.phone,
                formData.address,
                formData.role as UserRole
            );

            if (response.success) {
                const verifyResponse = await fetch('http://localhost:5000/auth/verify-session', {
                    credentials: 'include'
                });

                if (!verifyResponse.ok) {
                    throw new Error('Session verification failed');
                }
            }

        } catch (err) {
            console.error('Full error context:', {
                err,
                timestamp: new Date().toISOString(),
                endpoint: `/api/add-account`
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    let isSubmitting;
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    to="/manage-accounts"
                    className="btn btn-outline inline-flex items-center gap-2 mb-4"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Accounts
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Add New Account</h1>
                <p className="text-neutral-600 mt-2">Create a new user account with specific role permissions</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="Enter name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="Enter username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="organization" className="block text-sm font-medium text-neutral-700">
                                Organization
                            </label>
                            <input
                                type="text"
                                name="organization"
                                id="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="Enter your organization"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input"
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select a role</option>
                                <option value="farmer">Farmer</option>
                                <option value="processor">Processor</option>
                                <option value="distributor">Distributor</option>
                                <option value="retailer">Retailer</option>
                                <option value="regulator">Regulator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-100">
                        <Link to="/dashboard" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccount;