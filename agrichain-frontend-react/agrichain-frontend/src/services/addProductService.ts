import {ProductStatus} from "../types";

export interface AddProductResponse {
    success: boolean;
    message?: string;
    redirect?: string;
}

export const addProduct = async (
    productName: string,
    productDescription: string,
    productType: string,
    productImage: string,
    productStatus: ProductStatus,
    farmerUsername: string,
    farmerName: string,
    farmerOrganization: string,
    farmerAddress: string
): Promise<AddProductResponse> => {
    try {
        const response = await fetch("/api/register-product", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ // ajouter productID, batch, contractadress, timestamp
                productName,
                productDescription,
                productType,
                productImage,
                productStatus,
                farmerUsername,
                farmerName,
                farmerOrganization,
                farmerAddress
            })
        })

        const data = await response.json();

        const qrData = `${data.productID}|${data.contractAddress}`; // TODO: render qr code on client side

        if (!response.ok) {
            console.error('Backend error details:', data);
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return {
            ...data,
        qrCodeData: qrData};
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
