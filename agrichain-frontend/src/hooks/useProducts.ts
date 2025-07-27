import {useUserProfile} from "./useUserProfile.ts";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Product} from "../types";

export const useProducts = () => {
    const { user, loading } = useUserProfile();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        } else if (user) {
            fetchProducts();
        }
    }, [user, loading, navigate]);

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            setProductsError(null);

            const url = '/api/products';

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductsError(error instanceof Error ? error.message : 'Failed to fetch products');
            setProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };
    return { products, productsLoading, productsError};
}