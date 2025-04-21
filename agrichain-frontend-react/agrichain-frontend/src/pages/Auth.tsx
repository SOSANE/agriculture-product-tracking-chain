import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle, UserLock, SquareAsterisk } from 'lucide-react';
import { UserRole } from '../types';
import { authenticateWithCredentials } from '../services/authService';

interface AuthProps {
    onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const { role } = useParams<{ role: string }>();
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showWallet, setShowWallet] = useState(false);
    const [shouldShake, setShouldShake] = useState(false);

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setError(null);

        if (!role || !isValidRole(role)) {
            setError('Invalid role specified');
            setIsAuthenticating(false);
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 500);
            return;
        }

        try {
            const response = await authenticateWithCredentials(
                formData.username,
                formData.password,
                role as UserRole
            );

            if (response.success) {
                setShowWallet(true);
            } else {
                throw new Error(response.message || 'Authentication failed');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 500);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleMetaMaskConnect = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (role && isValidRole(role)) {
                onLogin(role as UserRole);
                navigate('/dashboard');
            } else {
                throw new Error('Invalid role specified');
            }
        } catch (err) {
            setError('Failed to connect to MetaMask. Please try again. Error: ' + err);
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 500);
        } finally {
            setIsConnecting(false);
        }
    };

    const isValidRole = (role: string): role is UserRole => {
        return ['admin','regulator', 'farmer', 'processor', 'distributor', 'retailer'].includes(role);
    };

    const getRoleDisplay = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 overflow-x-hidden">
            <div className={`relative w-full max-w-2xl mx-auto transition-all duration-500 ease-in-out ${shouldShake ? 'animate-shake' : ''}`}>
                <div className="flex w-full items-stretch">
                    {/* Login Form */}
                    <div className={`transition-all duration-500 ease-in-out ${showWallet ? 'w-1/2 pr-2' : 'w-full'}`}>
                        <div className={`card ${showWallet ? 'p-4' : 'p-6'}`}>
                            <h3 className={`${showWallet ? 'text-lg' : 'text-xl'} font-semibold mb-4 text-center md:text-left`}>
                                Enter Login Credentials
                            </h3>
                            <p className={`text-neutral-600 mb-6 text-center md:text-left ${showWallet ? 'text-sm' : ''}`}>
                                Enter your login credentials to authenticate
                            </p>

                            <form onSubmit={handleCredentialsSubmit}>
                                <div className="relative mb-4">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        className="input pl-10"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    />
                                    <UserLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                </div>
                                <div className="relative mb-4">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="input pl-10"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <SquareAsterisk className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={isAuthenticating}
                                >
                                    {isAuthenticating ? 'Authenticating...' : 'Login'}
                                </button>
                            </form>

                            {error && !showWallet && (
                                <div className="mt-4 text-error text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Wallet Connection */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showWallet ? 'w-1/2 pl-2 opacity-100' : 'w-0 pl-0 opacity-0'}`}>
                        <div className="card h-full p-4">
                            <div className="text-center mb-4">
                                <Wallet className="h-10 w-10 text-primary mx-auto mb-3" />
                                <h2 className="text-lg font-semibold mb-2">Connect Wallet</h2>
                                <p className="text-neutral-600 text-sm">
                                    Connect as {getRoleDisplay()}
                                </p>
                            </div>

                            {error && showWallet && (
                                <div className="bg-error bg-opacity-10 border border-error text-error rounded-lg p-3 mb-4 text-sm">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        <p>{error}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleMetaMaskConnect}
                                disabled={isConnecting}
                                className="btn btn-primary w-full mb-3"
                            >
                                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                            </button>

                            <button
                                onClick={() => setShowWallet(false)}
                                className="btn btn-outline w-full text-sm"
                            >
                                Back to Login
                            </button>

                            <p className="mt-4 text-xs text-neutral-500 text-center">
                                Ensure MetaMask is installed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;