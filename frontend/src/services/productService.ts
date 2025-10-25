interface ProductResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductById = async (productId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `[getProductById] - Failed to fetch product (Status: ${response.status})`,
      );
    }

    return await response.json();
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network request failed",
    };
  }
};

export const verifyProduct = async (
  productId: string,
): Promise<ProductResponse> => {
  try {
    const response = await fetch(`/api/verify-product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id: productId,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `[verifyProduct] - Failed to verify verify product (Status: ${response.status})`,
      );
    }
    const data = await response.json();
    return data.success;
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Network request failed",
    };
  }
};

export const downloadQrCode = (productId: string, imageUrl: string) => {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `QR_${productId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
