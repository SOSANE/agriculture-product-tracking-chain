import {ProductStatus} from "../types";

export const addProduct = async (
    productName: string,
    productDescription: string,
    productType: string,
    productImage: string,
    productStatus: ProductStatus,
    farmerUsername: string,
    productTemperature: string,
    productHumidity: string
): Promise<any> => {
    try {
        const response = await fetch("/api/register-product", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({
                name: productName,
                description: productDescription,
                type: productType,
                imageUrl: productImage,
                status: productStatus,
                farmerUsername,
                temperature: productTemperature,
                humidity: productHumidity
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend error details:', data);
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return {
            ...data,
            qrData: data.qrData
        };
    } catch (err) {
        console.error('Full error context:', {
            err,
            timestamp: new Date().toISOString(),
            endpoint: `/api/register-product`
        });
        return {
            success: false,
            message: err instanceof Error ? err.message : 'Network request failed'
        };
    }
};
