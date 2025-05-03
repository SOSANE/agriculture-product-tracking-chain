import {UserRole} from "../types";

export interface AddAccountResponse {
    success: boolean;
    message?: string;
    redirect?: string;
}

export const registerAccount = async (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    organization: string,
    phone: string,
    address: string,
    role: UserRole
): Promise<AddAccountResponse> => {
    try {
        const response = await fetch("/api/add-account", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, name, email, password, confirmPassword, organization, phone, address, role }),
        })

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend error details:', data);
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (err) {
        console.error('Full error context:', {
            err,
            timestamp: new Date().toISOString(),
            endpoint: `/api/add-account`
        });
        return {
            success: false,
            message: err instanceof Error ? err.message : 'Network request failed'
        };
    }
};