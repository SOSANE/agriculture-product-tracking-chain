import { useUserProfile } from "./useUserProfile.ts";
import { useEffect, useState } from "react";
import { Product } from "../types";

// Fetch all products
export const useProducts = () => {
  const { user, loading } = useUserProfile();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const url = "/api/products";
        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message +
              ` | Failed to fetch products: ${response.statusText}`,
          );
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProductsError(
          error instanceof Error ? error.message : "Failed to fetch products",
        );
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    if (!user && !loading) {
      throw new Error("[NOT CONNECTED]: Connect as a user to fetch products.");
    } else if (user) {
      fetchProducts();
    }
  }, [user, loading]);

  return { products, productsLoading, productsError };
};

// Product detail, individual object fetch
export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = `/api/products/${id}`;

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message +
              ` | Failed to fetch product (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load product";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id != undefined) {
      fetchProducts();
    } else {
      throw new Error(
        "[INVALID ARGUMENT]: Failed to fetch product, invalid product ID.",
      );
    }
  }, [id]);

  return { product, loading, error };
};

// All products
export const useAllProducts = () => {
  const { user, loading } = useUserProfile();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const url = "/api/all-products";

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message +
              ` | Failed to fetch all products (Status: ${response.status})`,
          );
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        setProductsError(errorMessage);
      } finally {
        setProductsLoading(false);
      }
    };

    if (!user && !loading) {
      throw new Error("[NOT CONNECTED]: Connect as a user to fetch products.");
    } else if (user) {
      loadProducts();
    }
  }, [user, loading]);

  return { products, productsLoading, productsError };
};
