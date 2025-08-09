import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// useParams
import { Wallet, AlertCircle, UserLock, SquareAsterisk } from 'lucide-react';
// import { UserRole } from '../types';
import { authenticateWithCredentials } from '../../services/authService';
// import {BrowserProvider, Contract} from "ethers";

type AuthProps = object

const Auth: React.FC<AuthProps> = () => {
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

        try {
            const response = await authenticateWithCredentials(
                formData.username,
                formData.password
            );

            if (response.success) {
                const verifyResponse = await fetch('/auth/verify-session', {
                    credentials: 'include'
                });

                if (!verifyResponse.ok) {
                    throw new Error('Session verification failed');
                }
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

            if(!window.ethereum) {
                console.error('MetaMask not Connected');
                throw new Error('Please insure you have MetaMask installed.');
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            const verifyResponse = await fetch('/auth/verify-session', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!verifyResponse.ok) {
                throw new Error('Session verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
                throw new Error(verifyData.message || 'Session invalid');
            }

            navigate('/dashboard');
        } catch (err) {
            setError('Failed to connect to MetaMask. Please try again. Error: ' + err);
            setShouldShake(true);
            setTimeout(() => setShouldShake(false), 500);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 overflow-x-hidden">
            <div className={`relative w-full max-w-2xl mx-auto transition-all duration-500 ease-in-out ${shouldShake ? 'animate-shake' : ''}`}>
                <div className="flex w-full items-stretch">
                    {/* Login Form */}
                    <div className={`transition-all duration-500 ease-in-out ${showWallet ? 'w-1/2 pr-2' : 'w-full'}`}>
                        <div className={`card h-full ${showWallet ? 'p-4' : 'p-6'} shadow-md`}>
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
                    <div className={`transition-all duration-500 ease-in-out ${showWallet ? 'w-1/2 pl-2 opacity-100' : 'w-0 pl-0 opacity-0'}`}>
                        <div className="card h-full p-4 shadow-md" style={{ minHeight: '100%' }}>
                            <div className="text-center mb-4">
                                <Wallet className="h-10 w-10 text-primary mx-auto mb-3" />
                                <h2 className="text-lg font-semibold mb-2">Connect Wallet</h2>
                                <p className="text-neutral-600 text-sm">
                                    Connect your Metamask account
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