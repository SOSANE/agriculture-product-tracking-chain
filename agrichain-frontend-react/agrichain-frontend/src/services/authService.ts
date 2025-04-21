import {UserRole} from "../types";

export interface AuthResponse {
    success: boolean;
    message?: string;
    role?: UserRole;
    redirect?: string;
}

export const authenticateWithCredentials = async (
    username: string,
    password: string,
    role: UserRole
): Promise<AuthResponse> => {
    try {
        const response = await fetch(`http://localhost:5000/auth/${role}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
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
            endpoint: `/auth/${role}`
        });
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Network request failed'
        };
    }
};