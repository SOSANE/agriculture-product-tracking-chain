import { User, UserRole } from "../types";

export interface AuthResponse {
    success: boolean;
    message?: string;
    role?: UserRole;
    redirect?: string;
}

export const authenticateWithCredentials = async (
    username: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend error details:', data);
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('Full error context:', {
            error,
            timestamp: new Date().toISOString(),
            endpoint: `/api/login`
        });
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Network request failed'
        };
    }
};

export const fetchUserProfile = async (): Promise<User> => {
    try {
        const response = await fetch(`http://localhost:5000/api/profile`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile', {error});
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        localStorage.clear();
        sessionStorage.clear();

        return await response.json();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};