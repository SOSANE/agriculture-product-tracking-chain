import {ProductStatus} from "../types";

// TODO: remove addProduct
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
        const response = await fetch("http://localhost:5000/api/register-product", {
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
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            credentials: "include"
        });

        if (!response.ok) {
            console.error('[getProductById] Backend error details:', response);
            throw new Error(`[getProductById] - Failed to fetch product (Status: ${response.status})`);
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
};

export const verifyProduct = async (productId: string): Promise<any> => {
    try {
        const response = await fetch(`http://localhost:5000/api/verify-product/${productId}`, {
            method: "POST",
            credentials: "include",
        });
        if (!response.ok) {
            console.error('[verifyProduct] Backend error details:', response);
            throw new Error(`[verifyProduct] - Failed to verify verify product (Status: ${response.status})`);
        }
        return response;
    } catch (err) {
        console.error('Full error context:', {
            err,
            timestamp: new Date().toISOString(),
            endpoint: `/api/verify-product/${productId}`
        });
        return {
            success: false,
            message: err instanceof Error ? err.message : 'Network request failed'
        }
    }
};

export const downloadQrCode = (productId: string, imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `QR_${productId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
