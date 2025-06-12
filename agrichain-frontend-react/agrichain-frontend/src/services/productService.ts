import {ProductStatus} from "../types";

export const addProduct = async (
    productName: string,
    productDescription: string,
    productType: string,
    productImage: string,
    productStatus: ProductStatus,
    farmerUsername: string,
    productTemperature: string | null,
    productHumidity: string | null
): Promise<any> => {
    try {
        const response = await fetch("/api/register-product", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ productName, productDescription, productType, productImage, productStatus, farmerUsername, productTemperature, productHumidity }),
        });


        console.log('PRODUCT SERVICE, response inputted: ', response);

        const data = await response.json();

        console.log('Data inputted: ', data); // undefined
        console.log('QrData ', data.qrData);

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

export const getProductById  = async (productId: string): Promise<any> => {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            credentials: "include"
        });

        if (!response.ok) {
            console.error('Backend error details:', response);
            throw new Error(`Failed to fetch product (Status: ${response.status})`);
        }

        return await response.json();
    } catch (err) {
        console.error('Full error context:', {
            err,
            timestamp: new Date().toISOString(),
            endpoint: `/api/products/${productId}`
        });
        return {
            success: false,
            message: err instanceof Error ? err.message : 'Network request failed'
        }
    }
}
