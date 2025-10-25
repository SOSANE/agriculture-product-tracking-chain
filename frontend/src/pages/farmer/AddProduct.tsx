import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { downloadQrCode } from "../../services/productService.ts";

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    imageUrl: "",
    status: "planted",
    temperature: "",
    humidity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          imageUrl: formData.imageUrl,
          status: formData.status,
          temperature: formData.temperature || null,
          humidity: formData.humidity || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      const qrData = data.qr_image;
      if (!qrData) {
        throw new Error("Failed to generate QR image");
      }
      downloadQrCode(data.id, qrData);
    } catch (err) {
      console.error("Full error context:", {
        err,
        timestamp: new Date().toISOString(),
        endpoint: `/api/register-product`,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let isSubmitting;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/products"
          className="btn btn-outline inline-flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-neutral-600 mt-2">
          Add a new product to the supply chain as a farmer
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700"
              >
                Name of your product
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
                placeholder="Enter the name of your product"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-neutral-700"
              >
                Type of your product
              </label>
              <input
                type="text"
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
                required
                placeholder="Enter the type of your product"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-neutral-700"
              >
                Temperature
              </label>
              <input
                type="number"
                name="temperature"
                id="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="input"
                placeholder="Temperature measured for your product (not required)"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="humidity"
                className="block text-sm font-medium text-neutral-700"
              >
                Humidity
              </label>
              <input
                type="number"
                name="humidity"
                id="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="input"
                placeholder="Humidity measured of your product (not required)"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-700"
              >
                Describe your product
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                required
                placeholder="Enter a description of your product"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-neutral-700"
              >
                Image of your product
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input"
                required
                placeholder="Enter an image URL of your product"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-neutral-700"
              >
                Current status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select the status of your product</option>
                <option value="planted">planted</option>
                <option value="growing">growing</option>
                <option value="harvested">harvested</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-neutral-100">
            <Link to="/dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding a new product to the blockchain...
                </>
              ) : (
                "Add Your Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
