import React from "react";
import { Package, PackagePlus, ShoppingBag } from "lucide-react";
import { useUserProfile } from "../../hooks/useUserProfile.ts";
import { DashboardLayout } from "../../components/layout/DashboardLayout.tsx";
import NavigationCard from "../../components/layout/NavigationCard.tsx";
import Header from "../../components/layout/Header";

const RetailerDashboard: React.FC = () => {
  const { user } = useUserProfile();

  const buttons = [
    {
      icon: PackagePlus,
      link: "/add-product",
      text: "Add New Product",
      class: "btn btn-primary w-full justify-start",
    },
    {
      icon: Package,
      link: "/manage-products",
      text: "Manage My Products",
      class: "btn btn-accent w-full justify-start",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Header
          user={user}
          altHeader="Retailer Dashboard"
          text="Manage store inventory as a retailer"
          altText="Manage store inventory"
        />
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <div
              className="card"
              style={{ height: "fit-content", minHeight: "100%" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Store Inventory</h2>
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <p className="text-neutral-600">No products in inventory</p>
            </div>
          </div>
          <NavigationCard buttons={buttons} isAdmin={false} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default RetailerDashboard;
