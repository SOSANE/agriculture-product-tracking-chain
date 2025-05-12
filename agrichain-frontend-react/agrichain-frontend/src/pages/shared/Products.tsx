import React, {useEffect, useState} from "react";
import {DashboardLayout} from "../../components/layout/DashboardLayout.tsx";
import {Link} from "react-router-dom";
import {Product} from "../../types";


export const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch(`/api/all-products`, {
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        loadProducts();
    })
    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <header className="text-center mb-10">
                            <h1 className="text-3xl font-semibold mb-2">Available products on the blockchain</h1>
                            <p className="text-neutral-600 max-w-xl mx-auto">
                                View the details for any product registered to the blockchain as a user.
                            </p>
                        </header>
                        {products.length > 0 && (
                            products.map((product) => (
                                <section key={product.id}>
                                    <div className="card h-full flex flex-col">
                                        <Link to={`/products/${product.id}`} className="block">
                                            <div
                                                className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                                <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-neutral-600">{product.description}</p>
                                                    <p className="text-xs text-neutral-500 mt-1">{product.type}</p>
                                                    <p className="text-xs text-neutral-500 mt-1">{product.farmer.name}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </section>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
};

export default Products;