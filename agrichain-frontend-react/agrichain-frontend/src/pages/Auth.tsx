import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
    onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMetaMaskConnect = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            // DEMO : This is where MetaMask integration will go
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (role && isValidRole(role)) {
                onLogin(role as UserRole);
                navigate('/dashboard');
            } else {
                throw new Error('Invalid role specified');
            }
        } catch (err) {
            setError('Failed to connect to MetaMask. Please try again. Error: ' + err);
        } finally {
            setIsConnecting(false);
        }
    };

    const isValidRole = (role: string): role is UserRole => {
        return ['regulator', 'farmer', 'processor', 'distributor', 'retailer'].includes(role);
    };

    const getRoleDisplay = () => {
        return role?.charAt(0).toUpperCase() + role?.slice(1);
    };

    if (!role || !isValidRole(role)) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="card p-8 max-w-md w-full">
                    <div className="text-center text-error">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Invalid Role</h2>
                        <p className="text-neutral-600 mb-6">The specified role is not valid.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-primary w-full"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="card p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Connect Wallet</h2>
                    <p className="text-neutral-600">
                        Connect your MetaMask wallet to continue as {getRoleDisplay()}
                    </p>
                </div>

                {error && (
                    <div className="bg-error bg-opacity-10 border border-error text-error rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleMetaMaskConnect}
                    disabled={isConnecting}
                    className="btn btn-primary w-full mb-4"
                >
                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline w-full"
                >
                    Cancel
                </button>

                <p className="mt-6 text-sm text-neutral-500 text-center">
                    Make sure you have MetaMask installed and are connected to the correct network.
                </p>
            </div>
        </div>
    );
};

export default Auth;