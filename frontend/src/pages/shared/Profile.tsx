import {useUserProfile} from "../../hooks/useUserProfile.ts";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import {Link, Navigate} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {ArrowLeft, Edit, Save, X} from "lucide-react";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile: React.FC = () => {
    const {user, loading, error} = useUserProfile();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        organization: '',
        email: '',
        phone: '',
        address: '',
        role: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalData, setOriginalData] = useState({...formData});

    useEffect(() => {
        if (user) {
            const userData = {
                username: user.username || '',
                name: user.name || '',
                organization: user.organization || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                role: user.role || '',
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/profile/edit', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            setOriginalData({...formData});
            setIsEditing(false);
            toast.success('Profile updated successfully!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            return data;
        } catch (err) {
            console.error('Full error context:', {
                err,
                timestamp: new Date().toISOString(),
                endpoint: `/api/profile/edit`
            });
            toast.error('Failed to update profile. Please try again.', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleEditMode = () => {
        if (isEditing) {
            setFormData({...originalData});
        }
        setIsEditing(!isEditing);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="output">
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

    if (!user) return <Navigate to="/"/>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer/>
            <Link
                to="/dashboard"
                className="btn btn-outline inline-flex items-center gap-2 mb-4"
            >
                <ArrowLeft className="h-5 w-5"/>
                Back to Dashboard
            </Link>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-neutral-600 mt-2">Hello {user.name}! Manage and edit your profile</p>
                </div>
                <button
                    onClick={toggleEditMode}
                    className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'} inline-flex items-center gap-2`}
                >
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4"/>
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit className="h-4 w-4"/>
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Personal Information</h2>
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
                                    Your Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                                    Your Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="address" className="block text-sm font-medium text-neutral-700">
                                    Your Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Additional Information</h2>
                            <div className="space-y-2">
                                <label htmlFor="organization" className="block text-sm font-medium text-neutral-700">
                                    Your Organization
                                </label>
                                <input
                                    type="text"
                                    name="organization"
                                    id="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label htmlFor="role" className="block text-sm font-medium text-neutral-700">
                                    Your Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input"
                                    disabled={!isEditing}
                                >
                                    <option value="">Select your desired role</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="processor">Processor</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="retailer">Retailer</option>
                                    <option value="regulator">Regulator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div
                            className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={toggleEditMode}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2"/>
                                        Save changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}