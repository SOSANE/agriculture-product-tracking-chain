import React from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import Layout from "../layout/Layout";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { Link, Navigate } from "react-router-dom";
import { Product } from "../../types";
import ProductCard from "../product/ProductCard";
import { useProducts } from "../../hooks/useProducts.ts";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  showProducts?: boolean;
  showRecentProducts?: boolean;
  customProductView?: (products: Product[]) => React.ReactNode;
}

export const DashboardLayout = ({
  children,
  showProducts = true,
  showRecentProducts = true,
  customProductView,
}: DashboardLayoutProps) => {
  const { user, loading, error } = useUserProfile();
  const { products, productsLoading, productsError } = useProducts();

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          <Alert.Heading>Profile Load Error</Alert.Heading>
          <p>{error.message}</p>
          <p className="mb-0">Please refresh or try again later.</p>
        </Alert>
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;

  const renderProducts = () => {
    if (productsLoading) {
      return (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading products...</span>
          </Spinner>
        </div>
      );
    }

    if (productsError) {
      return (
        <Alert variant="danger" className="mb-4">
          {productsError}
        </Alert>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No products found</p>
          {user?.role === "farmer" && (
            <Link to="/products/new" className="btn btn-primary">
              Add Your First Product
            </Link>
          )}
        </div>
      );
    }

    if (customProductView) {
      return customProductView(products);
    }

    return (
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <Layout user={user}>
      {children}
      {showProducts && (
        <div className="container mx-auto px-4 py-8">
          <section className="mb-10">
            {showRecentProducts && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Products</h2>
                <Link to="/products" className="text-accent hover:underline">
                  View All Products
                </Link>
              </div>
            )}
            {renderProducts()}
          </section>
        </div>
      )}
    </Layout>
  );
};
